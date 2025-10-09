import mongoose from 'mongoose';

const refundRequestSchema = new mongoose.Schema(
  {
    // 🔗 Core References
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    // 💰 Financial Details
    amount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    currency: { 
      type: String, 
      required: true,
      default: 'ETB' 
    },
    refundMethod: { 
      type: String, 
      enum: ['original_payment', 'bank_transfer', 'wallet', 'credit'],
      default: 'original_payment'
    },

    // 📝 Request Details
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    additionalInfo: { 
      type: String,
      trim: true 
    }, // For follow-up requests

    // 🎛️ Status Workflow
    status: {
      type: String,
      enum: ['pending', 'under_review', 'additional_info', 'approved', 'refunded', 'rejected', 'cancelled', 'failed'],
      default: 'pending',
      index: true
    },

    // 👨‍💼 Admin Processing
    adminNote: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },

    // ⏰ Timeline Tracking
    requestedAt: { 
      type: Date, 
      default: Date.now 
    },
    responseDeadline: { 
      type: Date 
    },
    firstResponseAt: { 
      type: Date 
    },

    // 💬 Communication & Audit
    communications: [{
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: { type: String, required: true },
      sentAt: { type: Date, default: Date.now },
      isInternal: { type: Boolean, default: false }
    }],
    ipAddress: { type: String },
    userAgent: { type: String },

    // 🛡️ Abuse Prevention
    userRefundCount: { type: Number, default: 0 },
    courseRefundCount: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },

    // 💳 Refund Transaction
    refundTransaction: {
      transactionId: { type: String },
      status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      },
      completedAt: { type: Date },
      gatewayResponse: { type: mongoose.Schema.Types.Mixed }
    },

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Pre-save hook: Validation, auto-set fields
refundRequestSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.user;
    // Increment user/course refund counts (aggregate from existing)
    const RefundRequest = mongoose.model('RefundRequest');
    this.userRefundCount = await RefundRequest.countDocuments({ user: this.user, isDeleted: false });
    this.courseRefundCount = await RefundRequest.countDocuments({ course: this.course, isDeleted: false });
    // Check policy (e.g., from SiteSetting, simplified)
    if (this.userRefundCount > 5) this.isFlagged = true;
  }
  if (this.isModified('status')) {
    if (this.status === 'under_review' && !this.firstResponseAt) this.firstResponseAt = new Date();
    if (['approved', 'refunded', 'rejected'].includes(this.status)) {
      this.processedAt = new Date();
      this.updatedBy = this.updatedBy || this.processedBy;
    }
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
  }
  next();
});

// Post-save hook: Update related models on status change
refundRequestSchema.post('save', async function(doc) {
  if (this.isModified('status')) {
    const Payment = mongoose.model('Payment');
    const Enrollment = mongoose.model('Enrollment');
    if (doc.status === 'refunded') {
      await Payment.findByIdAndUpdate(doc.payment, { status: 'refunded' });
      await Enrollment.findByIdAndUpdate(doc.enrollment, { status: 'expired' });
    } else if (doc.status === 'approved') {
      // Trigger refund transaction (integrate gateway in controller)
      await Payment.findByIdAndUpdate(doc.payment, { status: 'pending' });
    }
    // Log audit if Auditlog model exists
    if (mongoose.models.Auditlog) {
      await mongoose.model('Auditlog').create({
        user: doc.processedBy || doc.user,
        action: `refund_request_${doc.status}`,
        resourceId: doc._id,
        details: { amount: doc.amount, reason: doc.reason }
      });
    }
  }
});

// Virtual: Full refund amount (with potential tax/fee deduction)
refundRequestSchema.virtual('fullRefundAmount').get(function() {
  const fee = this.amount * 0.05; // 5% processing fee example
  return Math.max(0, this.amount - fee);
});

// Virtual: Days since request (for admin dashboard deadlines)
refundRequestSchema.virtual('daysPending').get(function() {
  return Math.round((new Date() - this.requestedAt) / (1000 * 60 * 60 * 24));
});

// Static: Get pending requests for admin finance/moderation
refundRequestSchema.statics.getPendingRequests = async function(limit = 50) {
  return this.find({ status: { $in: ['pending', 'under_review'] }, isDeleted: false })
    .populate('user payment course processedBy')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static: Get refund stats for platform analytics
refundRequestSchema.statics.getRefundStats = async function() {
  return this.aggregate([
    { $match: { isDeleted: false } },
    { $group: { 
      _id: '$status',
      count: { $sum: 1 },
      totalAmount: { $sum: '$amount' }
    } },
    { $sort: { _id: 1 } }
  ]);
};

// Method: Add communication (for student/admin interactions)
refundRequestSchema.methods.addCommunication = async function(message, sender, isInternal = false) {
  this.communications.push({ message, sender, isInternal });
  await this.save();
  return this.communications[this.communications.length - 1];
};

// 🔍 Critical Indexes
refundRequestSchema.index({ user: 1, status: 1 });
refundRequestSchema.index({ course: 1, status: 1 });
refundRequestSchema.index({ status: 1, createdAt: -1 });
refundRequestSchema.index({ payment: 1 });
refundRequestSchema.index({ processedBy: 1, status: 1 });
refundRequestSchema.index({ createdAt: -1, amount: -1 });
refundRequestSchema.index({ isDeleted: 1, status: 1 }); // For active queries
refundRequestSchema.index({ userRefundCount: -1 }); // For abuse detection

// Ensure virtuals are included in toJSON/toObject for API responses
refundRequestSchema.set('toJSON', { virtuals: true });
refundRequestSchema.set('toObject', { virtuals: true });

export default mongoose.model('RefundRequest', refundRequestSchema);