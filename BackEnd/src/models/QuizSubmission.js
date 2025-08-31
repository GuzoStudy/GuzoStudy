import mongoose from 'mongoose';

const quizSubmissionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedOption: { type: Number, required: true },
    }
  ],
  score: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('QuizSubmission', quizSubmissionSchema);
