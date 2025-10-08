import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // 🔹 Single course OR multiple courses — only one should be used
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course',
      // ❌ Remove `required: true` — we'll validate based on `type`
    },
    courses: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course' 
    }],

    amount: { type: Number, required: true },
   // Enhanced (multi-currency ready):
    currency: { 
      type: String, 
      required: true,
      default: 'ETB',
      enum: ['ETB', 'USD', 'EUR', 'GBP'] // Add supported currencies
    },
    exchangeRate: { 
      type: Number,
      default: 1 
    }, // For multi-currency reporting
    originalAmount: { 
      type: Number 
    }, // Amount in user's original currency
    originalCurrency: { 
      type: String 
    },
    // Add gateway metadata
    gateway: {
      name: { 
        type: String, 
        enum: ['chapa', 'stripe', 'paypal', 'local_bank'],
        default: 'chapa'
      },
      response: { 
        type: mongoose.Schema.Types.Mixed 
      }, // Raw gateway response for debugging
      webhookReceived: { 
        type: Boolean, 
        default: false 
      },
      webhookPayload: { 
        type: mongoose.Schema.Types.Mixed 
      }
    },

    // Add customer payment details (for receipts)
    customer: {
      email: { type: String },
      name: { type: String },
      phone: { type: String }
    },
    // Enhanced revenue sharing
    commission: {
      instructor: {
        percentage: { type: Number, default: 70 },
        amount: { type: Number, default: 0 }
      },
      platform: {
        percentage: { type: Number, default: 30 },
        amount: { type: Number, default: 0 }
      },
      tax: {
        percentage: { type: Number, default: 0 },
        amount: { type: Number, default: 0 }
      }
    },

    // Add payout tracking
    payout: {
      status: { 
        type: String, 
        enum: ['pending', 'processed', 'paid', 'failed'],
        default: 'pending'
      },
      processedAt: { type: Date },
      payoutId: { type: String }, // External payout reference
      notes: { type: String }
    },
    // Add receipt generation
    receipt: {
      issued: { type: Boolean, default: false },
      issuedAt: { type: Date },
      receiptNumber: { type: String, unique: true },
      pdfUrl: { type: String } // Generated receipt PDF
    },

    // Add invoice fields
    invoice: {
      number: { type: String, unique: true },
      issuedAt: { type: Date },
      dueDate: { type: Date },
      status: { 
        type: String, 
        enum: ['draft', 'issued', 'paid', 'overdue'],
        default: 'draft'
      }
    },
    // Add fraud prevention
    fraud: {
      riskScore: { type: Number, min: 0, max: 100, default: 0 },
      flagged: { type: Boolean, default: false },
      reason: { type: String },
      ipAddress: { type: String },
      userAgent: { type: String }
    },

    // Instructor & platform share
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    instructorShare: { type: Number, default: 0 },
    instructorSharePercent: { type: Number, default: 70 },
    platformShare: { type: Number, default: 0 },

    // Status & method
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'], 
      default: 'pending' 
    },
    paymentMethod: { 
      type: String, 
      enum: ['chapa'], 
      required: true 
    },
    transactionId: { type: String, required: true, unique: true },
    refundedAt: { type: Date },
    notes: { type: String },
    type: { 
      type: String, 
      enum: ['single', 'cart'], 
      default: 'single' 
    },
    coupon: { type: String },

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  { timestamps: true }
);

// Consolidated pre('validate') hook for type consistency and calculations
paymentSchema.pre('validate', function (next) {
  // Ensure amount is positive
  if (this.amount <= 0) {
    this.invalidate('amount', 'Amount must be greater than 0');
  }

  if (this.type === 'single') {
    if (!this.course) {
      this.invalidate('course', 'course is required for single-type payments');
    }
    if (this.courses && this.courses.length > 0) {
      this.invalidate('courses', 'courses must be empty for single-type payments');
    }
    // Auto-set courses array for consistency
    this.courses = [];
  } else if (this.type === 'cart') {
    if (!this.courses || this.courses.length === 0) {
      this.invalidate('courses', 'courses is required for cart-type payments');
    }
    if (this.course) {
      this.invalidate('course', 'course must be null for cart-type payments');
    }
    // Auto-clear single course
    this.course = undefined;
  }

  // Auto-calculate revenue shares
  if (this.status === 'completed' && this.amount > 0) {
    const instructorPct = this.instructorSharePercent || 70;
    this.instructorShare = (this.amount * instructorPct) / 100;
    this.platformShare = this.amount - this.instructorShare;
    // Update commission subfields
    this.commission.instructor.amount = this.instructorShare;
    this.commission.platform.amount = this.platformShare;
  }

  next();
});

// Pre-save hook: Auto-generate invoice/receipt numbers, set audit
paymentSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.user;
    // Generate unique invoice number (e.g., INV-YYYYMMDD-XXXX)
    if (!this.invoice.number) {
      const count = await mongoose.model('Payment').countDocuments({ 'invoice.number': { $exists: true } });
      this.invoice.number = `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(count + 1).padStart(4, '0')}`;
    }
    // Generate receipt number similarly
    if (!this.receipt.receiptNumber) {
      this.receipt.receiptNumber = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }
    // Set instructor from course if single
    if (this.type === 'single' && this.course) {
      const Course = mongoose.model('Course');
      const course = await Course.findById(this.course).select('instructor');
      this.instructor = course?.instructor;
    } else if (this.type === 'cart' && this.courses?.length > 0) {
      // Aggregate instructors or set primary
      this.instructor = null; // Handle in controller
    }
  }
  if (this.isModified('status')) {
    if (this.status === 'completed') {
      this.invoice.status = 'paid';
      this.invoice.issuedAt = new Date();
      this.receipt.issued = true;
      this.receipt.issuedAt = new Date();
      // Update enrollment status if linked
      if (this.enrollment) {
        const Enrollment = mongoose.model('Enrollment');
        await Enrollment.findByIdAndUpdate(this.enrollment, { status: 'active' });
      }
    } else if (this.status === 'refunded') {
      this.refundedAt = new Date();
      // Link to refund request if available
    }
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
  }
  next();
});

// Post-save hook: Trigger payout processing, notifications
paymentSchema.post('save', async function(doc) {
  if (this.isModified('status') && doc.status === 'completed') {
    // Trigger instructor notification
    const Notification = mongoose.model('Notification');
    await new Notification({
      user: doc.instructor,
      type: 'payment_received',
      title: 'New Enrollment Payment',
      message: `Payment of ${doc.amount} ${doc.currency} received for your course.`,
      related: doc._id,
      relatedModel: 'Payment'
    }).save();

    // Queue payout if needed (integrate with cron or service)
    if (doc.payout.status === 'pending') {
      // Update payout status based on business logic
    }

    // Log audit
    if (mongoose.models.Auditlog) {
      await mongoose.model('Auditlog').create({
        user: doc.user,
        action: 'payment_completed',
        resourceId: doc._id,
        details: { amount: doc.amount, transactionId: doc.transactionId }
      });
    }
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
  }
});

// Virtual: Formatted amount (with currency)
paymentSchema.virtual('formattedAmount').get(function() {
  return `${this.amount.toFixed(2)} ${this.currency}`;
});

// Virtual: Net amount (after commission/tax)
paymentSchema.virtual('netAmount').get(function() {
  return this.amount - (this.commission.tax.amount || 0);
});

// Virtual: Refund requests (for admin finance)
paymentSchema.virtual('refundRequests', {
  ref: 'RefundRequest',
  localField: '_id',
  foreignField: 'payment'
});

// Static: Get platform revenue overview (monthly breakdowns)
paymentSchema.statics.getRevenueOverview = async function() {
  return this.aggregate([
    { $match: { status: 'completed', isDeleted: false } },
    { $group: { 
      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      total: { $sum: '$platformShare' },
      count: { $sum: 1 },
      avgAmount: { $avg: '$amount' }
    } },
    { $sort: { _id: 1 } }
  ]);
};

// Static: Get instructor payouts (aggregate shares)
paymentSchema.statics.getPayouts = async function(instructorId) {
  return this.aggregate([
    { $match: { instructor: instructorId, status: 'completed', isDeleted: false, 'payout.status': 'pending' } },
    { $group: { 
      _id: '$instructor',
      totalPayout: { $sum: '$instructorShare' },
      payments: { $push: '$_id' }
    } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'instructor' } }
  ]);
};

// Static: Get purchase history for user (for student dashboard)
paymentSchema.statics.getPurchaseHistory = async function(userId) {
  return this.find({ user: userId, isDeleted: false })
    .populate('course courses enrollment')
    .sort({ createdAt: -1 });
};

paymentSchema.index({ user: 1, course: 1, transactionId: 1 });
paymentSchema.index({ user: 1, transactionId: 1 }); // for cart lookups
// Add these for production performance
paymentSchema.index({ status: 1, createdAt: -1 }); // Revenue dashboard
paymentSchema.index({ instructor: 1, status: 1 }); // Instructor earnings
paymentSchema.index({ transactionId: 1 }, { unique: true }); // Transaction lookup
paymentSchema.index({ enrollment: 1 }); // Enrollment integration
paymentSchema.index({ isDeleted: 1, status: 1 }); // Active payments only
paymentSchema.index({ 'commission.platform.amount': -1 }); // Revenue sorting

// Ensure virtuals are included in toJSON/toObject for API responses
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

export default mongoose.model('Payment', paymentSchema);
