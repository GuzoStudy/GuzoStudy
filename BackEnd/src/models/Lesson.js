import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  title: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'text', 'quiz'], required: true },
  textContent: { type: String },
  videoUrl: { type: String },
  duration: { type: Number },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);