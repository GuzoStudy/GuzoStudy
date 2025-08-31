import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  prerequisites: [{ type: String }],
  learningPaths: [{ type: String }],
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);