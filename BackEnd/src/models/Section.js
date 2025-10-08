import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },

    // Related Lessons & Quizzes
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],

    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],

    // ✅ For Admin - publish control (draft, published, archived)
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },

    // ✅ For Student Dashboard - Track how many students completed this section
    completedCount: {
      type: Number,
      default: 0,
    },
     // Add these fields
    analytics: {
      viewCount: { type: Number, default: 0 },
      averageCompletionTime: { type: Number, default: 0 }, // in minutes
      dropOffRate: { type: Number, default: 0 } // percentage
    },

    // Add estimated duration
    estimatedDuration: { 
      type: Number, // in minutes
      default: 0 
    },
    translations: [{
      language: { type: String, required: true },
      title: { type: String },
      description: { type: String }
    }],
    // Add to schema
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // ✅ For moderation (Admin Dashboard)
    moderation: {
      reviewed: { type: Boolean, default: false },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewNotes: { type: String },
      reviewDate: { type: Date }
    },
    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// 📊 Index for performance when listing sections by course and order
sectionSchema.index({ course: 1, order: 1, isDeleted: 1 });

// Additional indexes for admin analytics and course management
sectionSchema.index({ course: 1, status: 1, isDeleted: 1 });
sectionSchema.index({ completedCount: -1 }); // For top sections in analytics
sectionSchema.index({ 'analytics.viewCount': -1 }); // For popular sections

// Pre-save hook: Ensure unique order per course
sectionSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('order')) {
    const existing = await mongoose.model('Section').findOne({
      course: this.course,
      order: this.order,
      _id: { $ne: this._id },
      isDeleted: false
    });
    if (existing) {
      throw new Error('Order must be unique per course');
    }
  }
  if (this.isModified('updatedBy')) {
    this.updatedBy = this.updatedBy || this.createdBy;
  }
  next();
});

// 🪄 Auto-populate Lessons & Quizzes for easier Student Dashboard use
// Enhanced (select only needed fields):
sectionSchema.pre(/^find/, function (next) {
  // Only populate non-deleted content
  this.populate({
    path: 'lessons',
    match: { isDeleted: { $ne: true } },
    select: 'title contentType duration order'
  }).populate({
    path: 'quizzes',
    match: { isDeleted: { $ne: true } },
    select: 'title totalQuestions order'
  });
  next();
});

// 🧮 Virtual: Total number of lessons & quizzes (for analytics)
sectionSchema.virtual('contentCount').get(function () {
  return (this.lessons?.length || 0) + (this.quizzes?.length || 0);
});

// 🧮 Virtual: Total estimated duration (sum of lessons + quizzes)
sectionSchema.virtual('totalDuration').get(async function () {
  const Lesson = mongoose.model('Lesson');
  const Quiz = mongoose.model('Quiz');
  const [lessons, quizzes] = await Promise.all([
    Lesson.find({ _id: { $in: this.lessons }, isDeleted: false }).select('duration'),
    Quiz.find({ _id: { $in: this.quizzes }, isDeleted: false }).select('estimatedTime')
  ]);
  return lessons.reduce((sum, l) => sum + (l.duration || 0), 0) +
         quizzes.reduce((sum, q) => sum + (q.estimatedTime || 0), 0);
});

// 🧮 Virtual: Completion percentage (for progress bars in Student Dashboard)
sectionSchema.virtual('completionPercentage').get(async function () {
  if (this.status !== 'published') return 0;
  const Progress = mongoose.model('Progress');
  const Enrollment = mongoose.model('Enrollment');
  const totalContent = this.contentCount;
  if (totalContent === 0) return 0;
  const completed = await Progress.countDocuments({
    lesson: { $in: this.lessons },
    isCompleted: true,
  });
  const numEnrollments = await Enrollment.countDocuments({ course: this.course._id, isDeleted: false });
  const denominator = totalContent * numEnrollments;
  return denominator > 0 ? Math.round((completed / denominator) * 100) : 0;
});

// ✅ Helper: Mark section as completed (can be called from controller)
sectionSchema.methods.incrementCompletion = async function () {
  this.completedCount += 1;
  this.analytics.viewCount += 1; // Also increment views
  await this.save();
};

// Ensure virtuals are included in toJSON/toObject for API responses
sectionSchema.set('toJSON', { virtuals: true });
sectionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Section', sectionSchema);
