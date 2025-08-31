import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);