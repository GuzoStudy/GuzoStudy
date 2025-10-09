import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    enrolledAt: { type: Date, default: Date.now },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }, // ✅ add this
    certificateIssued: { type: Boolean, default: false }, // track if certificate is issued
    completedAt: { type: Date }, // when user completes the course
    progress: { type: Number, default: 0 }, // % progress (optional for quick analytics)
    isActive: { type: Boolean, default: true }, // if user unenrolls or banned
    // models/Enrollment.js
completedAt: { type: Date },

    // For subscription-based access
    accessExpiresAt: { 
      type: Date 
    }, // When course access expires

    // For cohort-based learning
    cohort: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Cohort' 
    },

    // For enterprise/team enrollments
    team: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Team' 
    },
    // Add payment reference
    payment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Payment' 
    },

    // Add pricing details (for historical accuracy)
    enrollmentPrice: { 
      type: Number,
      required: true 
    },
    currency: { 
      type: String, 
      default: 'ETB' 
    },
    discountApplied: { 
      type: Number, 
      default: 0 
    }, // Amount saved
    // For refund management
    refundStatus: { 
      type: String, 
      enum: ['none', 'requested', 'approved', 'rejected', 'processed'],
      default: 'none'
    },
    refundRequestedAt: { type: Date },
    refundProcessedAt: { type: Date },
    refundReason: { type: String },

    // For cancellation tracking
    cancelledAt: { type: Date },
    cancelledBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    cancellationReason: { type: String },
    // Marketing attribution
    source: { type: String }, // 'organic', 'paid', 'referral', etc.
    campaign: { type: String },
    referrer: { type: String },

    // Learning analytics
    firstLessonCompletedAt: { type: Date },
    averageTimePerLesson: { type: Number }, // in minutes
    timeSpent: { type: Number, default: 0 }, // Total time spent (aggregated from Progress)

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Pre-save hook: Enhanced validation, auto-set fields, audit
enrollmentSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.user;
    // Ensure unique active enrollment per user-course
    const existing = await mongoose.model('Enrollment').findOne({
      user: this.user,
      course: this.course,
      isActive: true,
      isDeleted: false,
      _id: { $ne: this._id }
    });
    if (existing) {
      return next(new Error('User already has an active enrollment for this course'));
    }
  }
  // Only auto-complete if payment is completed
  if (this.paymentStatus === 'completed' && 
      this.progress === 100 && 
      !this.completedAt) {
    this.completedAt = new Date();
    this.certificateIssued = false; // Reset if progress changes
  }
  
  // Auto-set enrollment price from course if not set
  if (!this.enrollmentPrice && this.isNew && this.course) {
    const Course = mongoose.model('Course');
    const course = await Course.findById(this.course).select('price');
    this.enrollmentPrice = course?.price || 0;
  }
  
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
    this.isActive = false;
  }
  next();
});

// Post-save hook: Trigger notifications, certificate issuance
enrollmentSchema.post('save', async function(doc) {
  if (this.isNew && doc.paymentStatus === 'completed') {
    // Trigger enrollment confirmation notification
    const Notification = mongoose.model('Notification');
    await new Notification({
      user: doc.user,
      type: 'enrollment',
      title: 'Enrollment Confirmed',
      message: `Welcome to "${doc.course.title}"! Start learning now.`,
      related: doc._id,
      relatedModel: 'Enrollment'
    }).save();

    // Log audit
    if (mongoose.models.Auditlog) {
      await mongoose.model('Auditlog').create({
        user: doc.user,
        action: 'enrollment_created',
        resourceId: doc._id,
        details: { course: doc.course, price: doc.enrollmentPrice }
      });
    }
  }
  if (this.isModified('progress') && doc.progress === 100 && !doc.certificateIssued) {
    // Issue certificate
    const Certificate = mongoose.model('Certificate');
    const cert = new Certificate({
      enrollment: doc._id,
      course: doc.course,
      user: doc.user
    });
    await cert.save();
    doc.certificateIssued = true;
    await doc.save();

    // Trigger certificate notification
    await new Notification({
      user: doc.user,
      type: 'certificate_issued',
      title: 'Certificate Earned!',
      message: `Congratulations! You've completed "${doc.course.title}" and earned your certificate.`,
      related: cert._id,
      relatedModel: 'Certificate'
    }).save();
  }
  if (this.isModified('timeSpent')) {
    // Update averageTimePerLesson if needed (aggregate from Progress)
  }
});

// Virtual: Total time spent (aggregate from Progress for student dashboard)
enrollmentSchema.virtual('totalTimeSpent').get(async function() {
  const Progress = mongoose.model('Progress');
  const total = await Progress.aggregate([
    { $match: { enrollment: this._id, isDeleted: false } },
    { $group: { _id: null, totalTime: { $sum: '$timeSpent' } } }
  ]);
  return total[0]?.totalTime || 0;
});

// Virtual: Upcoming items (lessons/quizzes not completed)
enrollmentSchema.virtual('upcomingItems').get(async function() {
  const Progress = mongoose.model('Progress');
  const completed = await Progress.find({ enrollment: this._id, status: 'completed' }).select('lesson quiz');
  const completedIds = completed.map(p => p.lesson || p.quiz).filter(Boolean);
  // Fetch from course sections/lessons/quizzes excluding completed
  // Implementation in controller for efficiency
  return []; // Placeholder
});

// Virtual: Certificates (ref for earned certificates)
enrollmentSchema.virtual('certificates', {
  ref: 'Certificate',
  localField: '_id',
  foreignField: 'enrollment'
});

// Static: Get enrollments growth for admin chart (monthly counts)
enrollmentSchema.statics.getEnrollmentsGrowth = async function() {
  return this.aggregate([
    { $match: { paymentStatus: 'completed', isDeleted: false } },
    { $group: { 
      _id: { $dateToString: { format: '%Y-%m', date: '$enrolledAt' } },
      count: { $sum: 1 },
      totalRevenue: { $sum: '$enrollmentPrice' }
    } },
    { $sort: { _id: 1 } }
  ]);
};

// Static: Get user enrollments with progress (for student dashboard)
enrollmentSchema.statics.getUserEnrollments = async function(userId) {
  return this.find({ 
    user: userId, 
    isActive: true, 
    isDeleted: false,
    accessExpiresAt: { $gt: new Date() } // Active enrollments
  })
    .populate('course certificates')
    .sort({ enrolledAt: -1 });
};

// 🔹 Ensure unique enrollment per user per course (active only)
enrollmentSchema.index({ user: 1, course: 1, isActive: 1, isDeleted: 1 }, { unique: true, partialFilterExpression: { isActive: true, isDeleted: false } });

// Add these for production performance
enrollmentSchema.index({ paymentStatus: 1, enrolledAt: -1 }); // Revenue dashboard
enrollmentSchema.index({ course: 1, paymentStatus: 1 }); // Course analytics
enrollmentSchema.index({ user: 1, isActive: 1, isDeleted: 1 }); // User dashboard
enrollmentSchema.index({ completedAt: -1 }); // Recently completed courses
enrollmentSchema.index({ progress: 1, user: 1 }); // Progress sorting
enrollmentSchema.index({ refundStatus: 1 }); // Refund management

// Ensure virtuals are included in toJSON/toObject for API responses
enrollmentSchema.set('toJSON', { virtuals: true });
enrollmentSchema.set('toObject', { virtuals: true });

export default mongoose.model('Enrollment', enrollmentSchema);
