const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
  password: { type: String }, 
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  authProvider: { type: String, enum: ['email', 'google', 'fiyda'], default: 'email' },
  providerId: { type: String },
  verified: { type: Boolean, default: false },
  refreshTokens: [{ type: String }],
  verificationToken: { type: String }, 
  verificationExpires: { type: Date }, 
  resetToken: { type: String }, 
  resetExpires: { type: Date }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);