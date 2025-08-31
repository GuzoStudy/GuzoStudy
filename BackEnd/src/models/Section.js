import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);