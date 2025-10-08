import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String, 
      trim: true 
    },
    commentHtml: { 
      type: String 
    }, // Rich text version
    attachments: [{ // Screenshots or supporting images
      filename: { type: String },
      url: { type: String },
      mimeType: { type: String }
    }],
    helpfulVotes: {
      up: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      down: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      // Add cached counts for performance
      upCount: { type: Number, default: 0 },
      downCount: { type: Number, default: 0 }
    },
    reportedCount: { 
      type: Number, 
      default: 0 
    },
    isEdited: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    editedAt: { 
      type: Date 
    },// Review status for workflow management
    status: {
      type: String,
      enum: ['active', 'pending', 'flagged', 'removed'],
      default: 'active',
      index: true
    },
    // Track review engagement
    analytics: {
      viewCount: { type: Number, default: 0 },
      clickThroughRate: { type: Number, default: 0 }, // If reviews drive course clicks
      responseRate: { type: Number, default: 0 } // Instructor responses
    },

    // Add instructor response (for engagement)
    instructorResponse: {
      comment: { type: String },
      respondedAt: { type: Date },
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    // Enhanced moderation
    moderation: {
      flagged: { type: Boolean, default: false },
      flaggedAt: { type: Date },
      reviewed: { type: Boolean, default: false },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewNotes: { type: String },
      autoFlagged: { type: Boolean, default: false } // AI/content filter
    },

    // Add ban tracking for abusive reviewers
    bannedFromReviewing: { 
      type: Boolean, 
      default: false 
    },
    // Add verification fields
    verified: { 
      type: Boolean, 
      default: false 
    },
    verifiedAt: { 
      type: Date 
    },
    // Verification reason (e.g., "completed_course", "purchased_course")
    verificationType: { 
      type: String,
      enum: ['completed_course', 'purchased_course', 'enrolled_course']
    },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Consolidated pre-save hook: Check uniqueness, update counts, set audit
reviewSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Check if user already has a non-deleted review
    const existing = await mongoose.model('Review').findOne({
      user: this.user,
      course: this.course,
      isDeleted: false
    });
    if (existing) {
      return next(new Error('User already has an active review for this course'));
    }
    this.createdBy = this.createdBy || this.user; // Assume creator is the user
  }
  if (this.isModified('helpfulVotes')) {
    this.helpfulVotes.upCount = this.helpfulVotes.up?.length || 0;
    this.helpfulVotes.downCount = this.helpfulVotes.down?.length || 0;
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
  }
  next();
});

// Post-save hook: Update course average rating (for analytics)
reviewSchema.post('save', async function(doc) {
  if (this.isNew || this.isModified('rating') || this.isModified('status')) {
    const Course = mongoose.model('Course');
    const reviews = await mongoose.model('Review').aggregate([
      { $match: { course: doc.course, status: 'active', isDeleted: false } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    await Course.findByIdAndUpdate(doc.course, {
      averageRating: reviews[0]?.avgRating || 0,
      reviewCount: reviews[0]?.count || 0
    });
  }
});

// 🚀 Index for fast querying by course and user
reviewSchema.index({ course: 1, createdAt: -1 });
reviewSchema.index({ user: 1, course: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } }); // One review per user per course (active only)
// Add these for production performance
reviewSchema.index({ rating: -1, createdAt: -1 }); // Top-rated reviews
reviewSchema.index({ reportedCount: -1, createdAt: -1 }); // Moderation queue
reviewSchema.index({ isDeleted: 1, createdAt: -1 }); // Active reviews only
reviewSchema.index({ status: 1, flagged: 1 }); // For flagged content in admin dashboard
reviewSchema.index({ course: 1, verified: 1 }); // Verified reviews for student dashboard

// Virtual: Net helpful votes (for sorting/display)
reviewSchema.virtual('netHelpfulVotes').get(function() {
  return (this.helpfulVotes.upCount || 0) - (this.helpfulVotes.downCount || 0);
});

// Static: Get average rating for a course (for admin/student analytics)
reviewSchema.statics.getAverageRating = async function(courseId) {
  const result = await this.aggregate([
    { $match: { course: courseId, status: 'active', isDeleted: false, verified: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  return result[0] || { avgRating: 0, count: 0 };
};

// Static: Get recent reviews for moderation (flagged/reported)
reviewSchema.statics.getForModeration = async function(limit = 20) {
  return this.find({ 
    $or: [{ status: 'flagged' }, { reportedCount: { $gt: 0 } }], 
    isDeleted: false 
  })
    .populate('user course reviewedBy respondedBy')
    .sort({ flaggedAt: -1, reportedCount: -1 })
    .limit(limit);
};

// Ensure virtuals are included in toJSON/toObject for API responses
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

export default mongoose.model('Review', reviewSchema);
