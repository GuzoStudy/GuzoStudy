import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, trim: true },
  contentType: { type: String, enum: ['video', 'text', 'quiz', 'assignment', 'audio'], required: true },
  content: { type: Object, required: true },
  order: { type: Number, required: true, min: 0, default: 0 },
  textContent: {
    html: { type: String }, // Rich text with images/embeds
    attachments: [{ // Downloadable resources
      filename: { type: String },
      url: { type: String },
      mimeType: { type: String }
    }]
  },
  video: {
    url: { type: String }, // CDN URL or local path
    filename: { type: String }, // Original filename
    fileSize: { type: Number }, // In bytes
    mimeType: { type: String, default: 'video/mp4' },
    thumbnail: { type: String } // Video preview image
  },
  duration: { type: Number },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isPreview: { type: Boolean, default: false },
  analytics: {
    viewCount: { type: Number, default: 0 },
    completionCount: { type: Number, default: 0 },
    averageTimeSpent: { type: Number, default: 0 }, // in seconds
    dropOffRate: { type: Number, default: 0 }
  },
  // Add moderation capabilities
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],

  // Add content validation
  isFlagged: { type: Boolean, default: false },
  flaggedReason: { type: String },
  order: { type: Number, default: 0 },

  // Soft delete fields
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },

  // Audit fields for Admin oversight
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Pre-save hook: Validate order uniqueness per section, set audit
lessonSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.section; // Assume from section creator
  }
  // Ensure unique order per section
  if (this.isNew || this.isModified('order')) {
    const existing = await mongoose.model('Lesson').findOne({
      section: this.section,
      order: this.order,
      _id: { $ne: this._id },
      isDeleted: false
    });
    if (existing) {
      return next(new Error('Order must be unique per section'));
    }
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.createdBy;
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
    // Cascade soft delete related progress
    await mongoose.model('Progress').updateMany({ lesson: this._id }, { isDeleted: true });
  }
  next();
});

// Post-save hook: Update section analytics if status changes
lessonSchema.post('save', async function(doc) {
  if (this.isModified('status') && doc.status === 'published') {
    const Section = mongoose.model('Section');
    await Section.findByIdAndUpdate(doc.section, {
      $inc: { estimatedDuration: doc.duration || 0 }
    });
    // Notify students if new lesson
    if (mongoose.models.Notification) {
      const Enrollment = mongoose.model('Enrollment');
      const enrollments = await Enrollment.find({ course: doc.course, status: 'active' }).select('user');
      enrollments.forEach(async (en) => {
        await new mongoose.model('Notification')({
          user: en.user,
          type: 'course_update',
          title: 'New Lesson Available',
          message: `A new lesson "${doc.title}" has been added to your course.`,
          related: doc._id,
          relatedModel: 'Lesson'
        }).save();
      });
    }
  }
  // Log audit
  if (mongoose.models.Auditlog) {
    await mongoose.model('Auditlog').create({
      user: doc.updatedBy || doc.createdBy,
      action: 'lesson_update',
      resourceId: doc._id,
      details: { status: doc.status, contentType: doc.contentType }
    });
  }
});

// Virtual: Full content URL (for video/text)
lessonSchema.virtual('contentUrl').get(function() {
  if (this.contentType === 'video' && this.video.url) {
    return this.video.url;
  }
  return null;
});

// Virtual: Completion percentage (aggregate from progress for admin/student analytics)
lessonSchema.virtual('completionPercentage').get(async function() {
  const Progress = mongoose.model('Progress');
  const totalProgress = await Progress.countDocuments({ lesson: this._id, isDeleted: false });
  const completed = await Progress.countDocuments({ lesson: this._id, status: 'completed', isDeleted: false });
  return totalProgress > 0 ? Math.round((completed / totalProgress) * 100) : 0;
});

// Virtual: Related progress entries (for dashboard)
lessonSchema.virtual('progressEntries', {
  ref: 'Progress',
  localField: '_id',
  foreignField: 'lesson'
});

// Static: Get lessons for section (ordered, filtered by status)
lessonSchema.statics.getForSection = async function(sectionId, options = {}) {
  return this.find({ 
    section: sectionId, 
    status: options.status || 'published',
    isDeleted: false 
  })
    .sort({ order: 1 })
    .populate('progressEntries', 'user status timeSpent'); // Partial for analytics
};

// Static: Get flagged lessons for admin moderation
lessonSchema.statics.getFlagged = async function() {
  return this.find({ isFlagged: true, isDeleted: false })
    .populate('section reports.user')
    .sort({ updatedAt: -1 });
};

// Add these indexes
lessonSchema.index({ section: 1, order: 1, isDeleted: 1 }); // Curriculum flow
lessonSchema.index({ contentType: 1, isDeleted: 1 }); // Content filtering
lessonSchema.index({ status: 1, isDeleted: 1 }); // Publishing workflow
lessonSchema.index({ 'analytics.viewCount': -1 }); // Popular lessons
lessonSchema.index({ isFlagged: 1, createdAt: -1 }); // Moderation queue

// Ensure virtuals are included in toJSON/toObject for API responses
lessonSchema.set('toJSON', { virtuals: true });
lessonSchema.set('toObject', { virtuals: true });

export default mongoose.model('Lesson', lessonSchema);
