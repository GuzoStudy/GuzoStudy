import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const preferenceSchema = new mongoose.Schema({
  topics: [{ type: String }],
  language: { type: String, default: 'en' },
  notificationsEnabled: { type: Boolean, default: true },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    password: {
      type: String,
      required: [
        function () {
          return !this.authProviders?.length;
        },
        'Password is required for non-social auth users'
      ],
      select: false
      // ❌ Removed validate from here
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin', 'superadmin'],
      default: 'student',
    },
    isVerified: {
      token: { type: String },
      expiresAt: { type: Date },
      verified: { type: Boolean, default: false }
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
      attempts: { type: Number, default: 0 }
    },
    bio: { type: String },
    profilePicture: { type: String },
    authProviders: [{
      provider: { type: String, enum: ['email', 'google', 'facebook'] },
      providerId: { type: String }
    }],
    learningPreferences: {
      preferredLearningStyle: { type: String },
      weeklyGoal: { type: Number },
      timezone: { type: String }
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },
    preferences: preferenceSchema,
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Validate password BEFORE hashing
userSchema.pre('validate', function (next) {
  if (this.isModified('password') && this.password && !this.authProviders?.length) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!regex.test(this.password)) {
      this.invalidate('password', 'Password must be at least 8 characters with uppercase, lowercase, and number');
    }
  }
  next();
});

// ✅ Hash password AFTER validation
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Virtual full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for profile picture URL
userSchema.virtual('profilePictureUrl').get(function () {
  if (!this.profilePicture) return null;
  return `${process.env.BASE_URL}/uploads/profiles/${this.profilePicture}`;
});

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ 'isVerified.verified': 1 });
userSchema.index({ isSuspended: 1 });
userSchema.index({ resetPasswordToken: 1, resetPasswordExpiry: 1 });

export default mongoose.model('User', userSchema);
