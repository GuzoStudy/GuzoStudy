import mongoose from 'mongoose';

// Enhanced question schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['multiple_choice', 'true_false', 'short_answer', 'matching'],
    default: 'multiple_choice'
  },
  
  // Multiple choice
  options: [{ type: String }],
  correctOption: { type: Number, min: 0 },
  
  // Add these fields
  analytics: {
    attemptCount: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    passRate: { type: Number, default: 0 } // Percentage
  },

  // Add metadata
  description: { type: String }, // Quiz instructions
  passingScore: { type: Number, default: 70 }, // Minimum % to pass
  shuffleQuestions: { type: Boolean, default: false },
  shuffleOptions: { type: Boolean, default: true },
  allowRetakes: { type: Boolean, default: true },
  maxAttempts: { type: Number, default: 0 }, // 0 = unlimited

  // Prevent cheating
  security: {
    showResultsImmediately: { type: Boolean, default: true },
    revealCorrectAnswers: { type: Boolean, default: true },
    requireFullScreen: { type: Boolean, default: false },
    detectTabSwitching: { type: Boolean, default: false }
  },

  // Moderation
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  isFlagged: { type: Boolean, default: false },

  section: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section' 
  },

  // Short answer (for future grading)
  correctAnswer: { type: String },
  answerRegex: { type: String }, // For flexible matching
  
  marks: { type: Number, default: 1, min: 0 },
  explanation: { type: String }, // Feedback for students
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, { _id: false });

// Quiz schema
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' }, // Optional link to section
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalMarks: { type: Number, default: 0 }, // calculated automatically
    isPublished: { type: Boolean, default: false }, // optional for draft quizzes
    duration: { type: Number, default: 0 }, // duration in minutes
    estimatedTime: { type: Number, default: 0 }, // For section total duration

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Pre-save hook to auto-calculate totalMarks
quizSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Ensure questions have section if provided
    if (this.section && this.questions) {
      this.questions.forEach(q => { q.section = this.section; });
    }
  }
  // Recalculate total marks
  if (this.questions && this.questions.length > 0) {
    this.totalMarks = this.questions.reduce((acc, q) => {
      // Handle edge cases
      if (q.marks == null || q.marks < 0) {
        q.marks = 1;
      }
      return acc + q.marks;
    }, 0);
  } else {
    this.totalMarks = 0;
  }
  
  // Auto-set duration based on questions (optional)
  if (!this.duration && this.questions?.length) {
    this.duration = Math.max(1, Math.ceil(this.questions.length * 0.5)); // 30 seconds per question
    this.estimatedTime = this.duration; // Sync for section virtuals
  }
  
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.createdBy;
  }
  next();
});

// Post-save hook: Update section estimated duration if changed
quizSchema.post('save', async function(doc) {
  if (doc.section && (doc.isNew || doc.isModified('estimatedTime'))) {
    const Section = mongoose.model('Section');
    await Section.findByIdAndUpdate(doc.section, {
      $inc: { estimatedDuration: doc.estimatedTime }
    });
  }
  // Cascade delete questions on soft delete
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
  }
});

// Virtual: Number of questions (for student dashboard)
quizSchema.virtual('questionCount').get(function() {
  return this.questions?.length || 0;
});

// Virtual: Average difficulty (for admin analytics)
quizSchema.virtual('avgDifficulty').get(function() {
  if (!this.questions?.length) return 'medium';
  const difficulties = { easy: 1, medium: 2, hard: 3 };
  const avg = this.questions.reduce((sum, q) => sum + (difficulties[q.difficulty] || 2), 0) / this.questions.length;
  return avg < 1.5 ? 'easy' : avg > 2.5 ? 'hard' : 'medium';
});

// Virtual: Pass rate (aggregate from submissions for student performance)
quizSchema.virtual('passRate').get(async function() {
  const QuizSubmission = mongoose.model('QuizSubmission');
  const results = await QuizSubmission.aggregate([
    { $match: { quiz: this._id, isDeleted: false, status: 'graded' } },
    { $group: { _id: null, total: { $sum: 1 }, passed: { $sum: { $cond: [{ $gte: ['$percentage', this.passingScore] }, 1, 0] } } } }
  ]);
  return results[0] ? Math.round((results[0].passed / results[0].total) * 100) : 0;
});

// Static: Get quizzes for course (with populated questions, filtered deleted)
quizSchema.statics.getForCourse = async function(courseId, options = {}) {
  return this.find({ 
    course: courseId, 
    isPublished: true, 
    isDeleted: false,
    ...(options.populateQuestions && { questions: { $exists: true, $ne: [] } })
  })
    .populate('section')
    .sort({ order: 1 }); // Assume order field if added
};

// Static: Get pending reviews/flag for admin moderation
quizSchema.statics.getFlagged = async function() {
  return this.aggregate([
    { $match: { isFlagged: true, isDeleted: false } },
    { $lookup: { from: 'questions', localField: 'questions', foreignField: '_id', as: 'flaggedQuestions', pipeline: [{ $match: { isFlagged: true } }] } },
    { $match: { $or: [{ isFlagged: true }, { 'flaggedQuestions': { $ne: [] } }] } }
  ]);
};

// Index updates
quizSchema.index({ course: 1, isPublished: 1, isDeleted: 1 }); // Course dashboard
quizSchema.index({ createdBy: 1, isDeleted: 1 }); // Instructor management
quizSchema.index({ isPublished: 1, createdAt: -1, isDeleted: 1 }); // Published quizzes
quizSchema.index({ section: 1, isPublished: 1, isDeleted: 1 }); // Section quizzes

// Ensure virtuals are included in toJSON/toObject for API responses
quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

export default mongoose.model('Quiz', quizSchema);
