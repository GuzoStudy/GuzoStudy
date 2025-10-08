import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // fast lookups by user
    },
    type: {
      type: String,
      required: true,
      enum: [
        "general", 
        "course_update", 
        "payment", 
        "payment_success", 
        "system", 
        "reminder", 
        "alert", 
        "certificate_issued",
        "announcement", // New course announcements
        "deadline", // Deadlines / Reminders
        "feedback", // Instructor Feedback
        "enrollment", // Enrollment confirmations
        "quiz_result" // Quiz performance
      ],
      default: "general",
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    relatedModel: {
      type: String,
      enum: ["Course", "Enrollment", "Payment", "User", "Certificate", "QuizSubmission", "Section"],
      default: "Course",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ["student", "instructor", "admin", "all"],
      default: "all",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
      index: true,
    },
    // Enhanced (more explicit):
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: { 
        expireAfterSeconds: 0,
        background: true 
      }
    },
    category: {
      type: String,
      enum: ['account', 'learning', 'payments', 'community', 'system'],
      default: 'system',
      index: true
    },
    delivery: {
      emailSent: { type: Boolean, default: false },
      emailSentAt: { type: Date },
      pushSent: { type: Boolean, default: false },
      pushSentAt: { type: Date },
      inAppDelivered: { type: Boolean, default: false },
      inAppDeliveredAt: { type: Date }
    },
    actionUrl: { 
      type: String,
      trim: true 
    }, // Deep link to relevant page

    actionText: { 
      type: String,
      default: 'View' 
    },
    // Respect user notification preferences
    respectPreferences: { 
      type: Boolean, 
      default: true 
    },

    // Add channel preferences (if you support multiple channels)
    channels: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true }
    },

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Consolidated pre-save middleware: Trim, generate action URL, set audit
notificationSchema.pre("save", async function (next) {
  // Trim and limit message length
  if (this.message && this.message.length > 300) {
    this.message = this.message.slice(0, 300) + "...";
  }
  
  // Auto-generate action URLs based on related model
  if (!this.actionUrl && this.relatedModel && this.relatedId) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    switch (this.relatedModel) {
      case 'Course':
        this.actionUrl = `${baseUrl}/courses/${this.relatedId}`;
        break;
      case 'Certificate':
        this.actionUrl = `${baseUrl}/certificates/${this.relatedId}`;
        break;
      case 'Enrollment':
        this.actionUrl = `${baseUrl}/enrollments/${this.relatedId}`;
        break;
      case 'Payment':
        this.actionUrl = `${baseUrl}/payments/${this.relatedId}`;
        break;
      case 'User':
        this.actionUrl = `${baseUrl}/profile/${this.relatedId}`;
        break;
      case 'QuizSubmission':
        this.actionUrl = `${baseUrl}/quizzes/${this.relatedId}`;
        break;
      case 'Section':
        this.actionUrl = `${baseUrl}/sections/${this.relatedId}`;
        break;
      // Add other cases as needed
    }
  }

  if (this.isNew) {
    this.createdBy = this.createdBy || this.user;
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
  }
  next();
});

// Post-save hook: Trigger delivery based on channels and preferences
notificationSchema.post("save", async function(doc) {
  if (this.isNew && doc.channels.inApp) {
    this.inAppDelivered = true;
    this.inAppDeliveredAt = new Date();
    await this.save();
    // Integrate email/push services in controller (e.g., Nodemailer, FCM)
    // Check user preferences from User model
    const User = mongoose.model('User');
    const user = await User.findById(doc.user).select('preferences');
    if (doc.respectPreferences && !user.preferences.notificationsEnabled) {
      // Skip delivery
      return;
    }
    if (doc.channels.email && !doc.delivery.emailSent) {
      // Queue email send
      // await sendEmail(doc.user.email, doc.message, doc.actionUrl);
      doc.delivery.emailSent = true;
      doc.delivery.emailSentAt = new Date();
      await doc.save();
    }
    if (doc.channels.push && !doc.delivery.pushSent) {
      // Queue push notification
      // await sendPush(doc.user.deviceToken, doc.message);
      doc.delivery.pushSent = true;
      doc.delivery.pushSentAt = new Date();
      await doc.save();
    }
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
  }
  // Log audit if needed
  if (mongoose.models.Auditlog) {
    await mongoose.model('Auditlog').create({
      user: doc.user,
      action: 'notification_sent',
      resourceId: doc._id,
      details: { type: doc.type, read: doc.read }
    });
  }
});

// Virtual: Formatted message with action (for student dashboard)
notificationSchema.virtual('formattedMessage').get(function() {
  return `${this.message} ${this.actionText ? `[${this.actionText}]` : ''}`;
});

// Virtual: Is overdue (for reminders/deadlines)
notificationSchema.virtual('isOverdue').get(function() {
  return this.expiresAt < new Date() && !this.read;
});

// Static: Get unread notifications for user (for student dashboard)
notificationSchema.statics.getUnreadForUser = async function(userId, limit = 20) {
  return this.find({ 
    user: userId, 
    read: false, 
    isDeleted: false,
    expiresAt: { $gt: new Date() }
  })
    .sort({ createdAt: -1, priority: -1 })
    .limit(limit)
    .populate('relatedId', 'title'); // Partial populate
};

// Static: Get notifications by type for admin (e.g., announcements, feedback)
notificationSchema.statics.getByType = async function(type, options = {}) {
  return this.find({ 
    type, 
    isDeleted: false,
    ...(options.role && { recipientRole: options.role }),
    expiresAt: { $gt: new Date() }
  })
    .sort({ createdAt: -1 })
    .populate('user', 'fullName');
};

// Static: Bulk mark as read (for student dashboard)
notificationSchema.statics.markAsRead = async function(userId, ids) {
  return this.updateMany(
    { _id: { $in: ids }, user: userId, isDeleted: false },
    { read: true }
  );
};

// 📌 Compound indexes for super-fast dashboard queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipientRole: 1, createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ createdAt: -1, type: 1, priority: 1 });
notificationSchema.index({ isDeleted: 1, read: 1, user: 1 }); // Active unread per user
notificationSchema.index({ category: 1, type: 1 }); // For filtering by category

// Ensure virtuals are included in toJSON/toObject for API responses
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

export default mongoose.model("Notification", notificationSchema);
