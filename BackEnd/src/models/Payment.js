import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    amount: { type: Number, required: true },
    instructorShare: { type: Number, default: 0 },
    currency: { type: String, default: 'ETB' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, default: 'Chapa' },
    transactionId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
