import mongoose from 'mongoose';

// Since questions are embedded, reference by position or use question text
const answerSchema = new mongoose.Schema({
  // Option A: Store question index (simplest)
  questionIndex: { type: Number, required: true },
  
  // Option B: Store question text (more robust)
  //questionText: { type: String, required: true },
  
  // Option C: Store the actual question object (denormalized but safe)
  //question: {
   // question: { type: String, required: true },
    //options: [{ type: String }],
   // correctOption: { type: Number, required: true }
  //},
  
  selectedOption: { type: Number, required: true },
  isCorrect: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 }
}, { _id: false });

const quizSubmissionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }, // Link to enrollment for context
    answers: [answerSchema],
    score: { type: Number, required: true, default: 0 },
    maxScore: { type: Number, required: true }, // total possible score
    percentage: { type: Number, min: 0, max: 100 }, // Derived
    attempts: { type: Number, default: 1 },     // track retry count
    completedAt: { type: Date, default: Date.now },
    graded: { type: Boolean, default: true },   // true if auto-graded
    // Link to certificate if quiz is certification-related
    certificate: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Certificate' 
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'graded', 'review_requested'],
      default: 'completed'
    },
    // For disputed grades
    appeal: {
      requested: { type: Boolean, default: false },
      reason: { type: String },
      reviewed: { type: Boolean, default: false },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewNotes: { type: String }
    },
    timeSpent: { type: Number, default: 0 }, // Total seconds spent
    startTime: { type: Date }, // When quiz was started

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  { timestamps: true }
);

// Pre-save hook: Calculate percentage, set audit, validate attempts
quizSubmissionSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.user;
    // Check max attempts from Quiz model
    const Quiz = mongoose.model('Quiz');
    const quiz = await Quiz.findById(this.quiz);
    if (quiz && this.attempts > quiz.maxAttempts) {
      return next(new Error('Maximum attempts exceeded'));
    }
  }
  // Calculate percentage if score/maxScore changed
  if (this.isModified('score') || this.isModified('maxScore')) {
    this.percentage = this.maxScore > 0 ? Math.round((this.score / this.maxScore) * 100) : 0;
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
  }
  next();
});

// Post-save hook: Update enrollment progress if linked
quizSubmissionSchema.post('save', async function(doc) {
  if (doc.enrollment && doc.status === 'graded') {
    const Progress = mongoose.model('Progress');
    const Enrollment = mongoose.model('Enrollment');
    // Update enrollment timeSpent and progress
    await Enrollment.findByIdAndUpdate(doc.enrollment, {
      $inc: { timeSpent: doc.timeSpent / 60 }, // Convert to minutes if needed
    });
    // Mark related progress as complete if high score
    if (doc.percentage >= 80) { // Threshold example
      await Progress.updateMany(
        { enrollment: doc.enrollment, quiz: doc.quiz },
        { isCompleted: true, completedAt: new Date() }
      );
    }
    // Trigger certificate if quiz completes course
    if (mongoose.models.Certificate && !doc.certificate) {
      // Logic to check if all quizzes complete → generate cert
    }
  }
  // Log audit if needed
  if (mongoose.models.Auditlog) {
    await mongoose.model('Auditlog').create({
      user: doc.user,
      action: 'quiz_submission',
      resourceId: doc.quiz,
      details: { score: doc.score, percentage: doc.percentage }
    });
  }
});

// Virtual: Pass/fail status (for student dashboard)
quizSubmissionSchema.virtual('passStatus').get(function() {
  return this.percentage >= 70 ? 'pass' : 'fail'; // Configurable threshold
});

// Virtual: Detailed feedback (aggregate correct answers)
quizSubmissionSchema.virtual('feedback').get(function() {
  const correct = this.answers.filter(a => a.isCorrect).length;
  return `${correct}/${this.answers.length} correct. Focus on weak areas.`;
});

// Static: Get user submissions for analytics/performance
quizSubmissionSchema.statics.getUserSubmissions = async function(userId, options = {}) {
  return this.find({ user: userId, isDeleted: false, status: 'graded' })
    .populate('quiz enrollment')
    .sort({ completedAt: -1 })
    .limit(options.limit || 10);
};

// Static: Leaderboard for a quiz (top scores)
quizSubmissionSchema.statics.getLeaderboard = async function(quizId, limit = 10) {
  return this.aggregate([
    { $match: { quiz: quizId, isDeleted: false, status: 'graded', percentage: { $gte: 50 } } },
    { $group: { _id: '$user', highestScore: { $max: '$percentage' } } },
    { $sort: { highestScore: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user', pipeline: [{ $project: { fullName: 1, profilePicture: 1 } }] } },
    { $unwind: '$user' }
  ]);
};

// 🚀 Ensure one submission per user per quiz per attempt
quizSubmissionSchema.index({ quiz: 1, user: 1, attempts: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
// Add these additional indexes
quizSubmissionSchema.index({ user: 1, completedAt: -1 }); // User dashboard
quizSubmissionSchema.index({ quiz: 1, score: -1 }); // Leaderboards
quizSubmissionSchema.index({ graded: 1, completedAt: -1 }); // Grading queue
quizSubmissionSchema.index({ enrollment: 1, status: 1 }); // For progress tracking
quizSubmissionSchema.index({ isDeleted: 1, status: 1 }); // Active queries

// Ensure virtuals are included in toJSON/toObject for API responses
quizSubmissionSchema.set('toJSON', { virtuals: true });
quizSubmissionSchema.set('toObject', { virtuals: true });

export default mongoose.model('QuizSubmission', quizSubmissionSchema);
