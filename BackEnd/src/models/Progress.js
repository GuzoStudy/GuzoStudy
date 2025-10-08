import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    enrollment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Enrollment', 
      required: true 
    }, // Better context than just course
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    section: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Section' 
    },
    lesson: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson' 
    },
    quiz: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Quiz' 
    },
    // Add these fields
    timeSpent: { 
      type: Number, 
      default: 0 
    }, // Total seconds spent on lesson/quiz

    lastAccessedAt: { 
      type: Date 
    }, // When user last interacted

    completionPercentage: { 
      type: Number, 
      min: 0, 
      max: 100,
      default: 0 
    }, // For long lessons (videos, readings)

    // Add metadata for analytics
    metadata: {
      deviceType: { type: String }, // 'mobile', 'desktop', 'tablet'
      userAgent: { type: String },
      ipAddress: { type: String }
    },
    status: { 
      type: String, 
      enum: ['not_started', 'in_progress', 'completed', 'failed', 'review_required'], 
      default: 'not_started' 
    },
    certificate: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Certificate' 
    },
    certificateIssuedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    score: { 
      type: Number, 
      min: 0, 
      max: 100 
    }, // useful for quizzes
    completedAt: { 
      type: Date 
    },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Pre-save hook: Set defaults, validate, audit
progressSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.user;
    if (!this.lastAccessedAt) this.lastAccessedAt = new Date();
  }
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
      // Auto-issue certificate if quiz/lesson completes requirements
      if (this.quiz || this.lesson) {
        // Logic to check if eligible (e.g., via Enrollment progress)
      }
    }
  }
  if (this.isModified('timeSpent')) {
    this.timeSpent = Math.max(0, this.timeSpent);
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
    this.lastAccessedAt = new Date();
  }
  next();
});

// Post-save hook: Update enrollment/section progress
progressSchema.post('save', async function(doc) {
  if (this.isModified('status') || this.isModified('completionPercentage') || this.isModified('timeSpent')) {
    const Enrollment = mongoose.model('Enrollment');
    const enrollment = await Enrollment.findById(doc.enrollment);
    if (!enrollment) return;

    // Update enrollment timeSpent
    enrollment.timeSpent += doc.timeSpent / 3600; // Convert seconds to hours if needed

    // Recalculate overall progress
    const totalItems = await mongoose.model('Progress').countDocuments({ 
      enrollment: doc.enrollment, 
      isDeleted: false 
    });
    const completedItems = await mongoose.model('Progress').countDocuments({ 
      enrollment: doc.enrollment, 
      status: 'completed', 
      isDeleted: false 
    });
    enrollment.progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    await enrollment.save();

    // If course complete (100%), trigger certificate and notification
    if (enrollment.progress === 100 && !enrollment.certificate) {
      const Certificate = mongoose.model('Certificate');
      const cert = new Certificate({ enrollment: doc.enrollment, course: doc.course, user: doc.user });
      await cert.save();
      enrollment.certificate = cert._id;
      await enrollment.save();

      // Trigger notification
      const Notification = mongoose.model('Notification');
      await new Notification({
        user: doc.user,
        type: 'certificate_earned',
        title: 'Course Completed!',
        message: `Congratulations! You've earned a certificate for ${enrollment.course.title}.`,
        related: enrollment._id,
        relatedModel: 'Enrollment'
      }).save();
    }

    // Log audit
    if (mongoose.models.Auditlog) {
      await mongoose.model('Auditlog').create({
        user: doc.user,
        action: 'progress_update',
        resourceId: doc._id,
        details: { status: doc.status, timeSpent: doc.timeSpent }
      });
    }
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
  }
});

// Virtual: Formatted time spent (for student dashboard)
progressSchema.virtual('formattedTimeSpent').get(function() {
  const hours = Math.floor(this.timeSpent / 3600);
  const minutes = Math.floor((this.timeSpent % 3600) / 60);
  return `${hours}h ${minutes}m`;
});

// Virtual: Is overdue (for quizzes with deadlines)
progressSchema.virtual('isOverdue').get(function() {
  // Assume deadline from Quiz model; return true if past
  return false; // Placeholder
});

// Static: Get user progress overview for course (for analytics/student dashboard)
progressSchema.statics.getUserProgress = async function(userId, courseId) {
  return this.find({ 
    user: userId, 
    course: courseId, 
    isDeleted: false 
  })
    .populate('lesson quiz section')
    .sort({ createdAt: -1 });
};

// Static: Get course completion stats (for admin analytics)
progressSchema.statics.getCourseStats = async function(courseId) {
  return this.aggregate([
    { $match: { course: courseId, isDeleted: false, status: 'completed' } },
    { $group: { 
      _id: null, 
      totalProgress: { $sum: '$completionPercentage' },
      avgTimeSpent: { $avg: '$timeSpent' },
      completionRate: { $avg: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
    } }
  ]);
};

// ✅ Ensure unique progress tracking per user–lesson/quiz pair
progressSchema.index({ 
  user: 1, 
  enrollment: 1, 
  lesson: 1, 
  isDeleted: 1 
}, { unique: true, sparse: true });

progressSchema.index({ 
  user: 1, 
  enrollment: 1, 
  quiz: 1, 
  isDeleted: 1 
}, { unique: true, sparse: true });
// Add this index for student course dashboards
progressSchema.index({ user: 1, course: 1, status: 1 });
progressSchema.index({ enrollment: 1, status: 1, completedAt: -1 }); // Progress tracking
progressSchema.index({ course: 1, isDeleted: 1 }); // Admin analytics
progressSchema.index({ 'metadata.deviceType': 1 }); // Analytics by device

// Ensure virtuals are included in toJSON/toObject for API responses
progressSchema.set('toJSON', { virtuals: true });
progressSchema.set('toObject', { virtuals: true });

export default mongoose.model('Progress', progressSchema);
