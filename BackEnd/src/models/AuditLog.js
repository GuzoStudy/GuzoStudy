import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        // Required only for admin-created actions
        return this.action && this.action.startsWith('admin_');
      },
    },
    action: {
      type: String,
      required: true,
      trim: true,
      enum: [ // Optional: add common actions for validation
        'register',  // Added for user registration
      'login',
      'logout',
      'create_admin',
      'course_approve',
      'course_reject',
      'course_delete',
      'payment_verify',
      'payment_refund',
      'refund_approve',
      'refund_reject',
      'user_suspend',
      'user_unsuspend',
      'user_promote',
      'user_demote',
      'content_delete',
      'content_warn',
      'content_ban_user',
      'platform_analytics_viewed',
      'viewed_audit_logs',
      'update_site_settings',
      'discussion_created',
      'discussion_reply_posted',
      'discussions_viewed',
      'discussion_deleted',
      'discussion_lock',
      'discussion_unlock',
      'discussion_resolve',
      'discussion_reopen',
      'discussion_ban_user',
      'enrollment_created',
      'instructor_stats_viewed',
      'review_submitted',
      'review_updated',
      'review_deleted',
      'quiz_created',
      'quiz_submitted',
      'verify_otp',
      'resend_otp',
      'refresh_token',
      'forgot_password',
      'reset_password',
      'update_profile',
      'user_authenticated',
      'create_superadmin',
      'course_update',
      'course_deleted',
      'section_created',
      'Section',
      'section_updated',
      'section_deleted',
      'lesson_created',
      'lesson_updated',
      'lesson_deleted',
      'payment_initiated',
      'payment_webhook',
      'payment_verified',
      'Quiz',
        'admin_user_created',
        'admin_user_updated', 
        'admin_user_deleted',
        'admin_course_approved',
        'admin_course_rejected',
        'admin_payment_refunded',
        'admin_settings_updated',
        'user_login',
        'user_logout',
        'course_created',
        'course_updated',
        'payment_completed',
        'enrollment_created',
        'progress_updated',
        'quiz_submitted',
        'certificate_issued',
        'discussion_posted',
        'review_submitted',
        'refund_processed',
        'notification_sent',
        'course_analytics_viewed',
        'course_analytics_viewed',
        'top_courses_viewed',
        'instructor_earnings_viewed',
        'instructor_analytics_viewed',
        'courses_searched',
        'lesson_completed',
        'course_viewed',
        'quiz_updated',
        'notifications_viewed'
        // Add more as needed
      ]
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetModel',
    },
    targetModel: {
      type: String,
      enum: [
        'User',
        'Course',
        'Payment',
        'Enrollment',
        'Review',
        'Discussion',
        'RefundRequest',
        'SiteSetting',
        'Progress',
        'QuizSubmission',
        'Certificate',
        'Notification',
        'Section',
        'Lesson',
        'Quiz',
        'QuizSubmission',
        'Platform'
      ],
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { 
      type: Object,
      default: {} 
    }, // optional extra info

    // Soft delete fields (logs are rarely deleted, but for compliance)
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields (for who logged the entry, if meta)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Pre-save hook: Set audit, validate action
auditLogSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.adminId;
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.adminId;
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
  }
  next();
});

// Virtual: Formatted timestamp (for admin dashboard)
auditLogSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});

// Virtual: User full details (populated)
auditLogSchema.virtual('fullDetails').get(async function() {
  if (!this.targetId || !this.targetModel) return null;
  const Model = mongoose.model(this.targetModel);
  return await Model.findById(this.targetId).lean();
});

// Static: Get recent system logs for admin dashboard
auditLogSchema.statics.getSystemLogs = async function(limit = 100, filters = {}) {
  const query = { 
    isDeleted: false,
    ...filters
  };
  return this.find(query)
    .populate('adminId', 'fullName email')
    .populate('createdBy', 'fullName email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static: Get logs by action (for auditing specific events)
auditLogSchema.statics.getByAction = async function(action, options = {}) {
  return this.find({ 
    action, 
    isDeleted: false,
    ...options
  })
    .populate('targetId', 'title name') // Dynamic based on model
    .sort({ createdAt: -1 });
};

// Static: Get suspicious logs (high-risk actions, IPs)
auditLogSchema.statics.getSuspicious = async function() {
  return this.aggregate([
    { $match: { 
      isDeleted: false,
      action: { $in: ['admin_user_deleted', 'admin_course_rejected', 'payment_refunded'] }
    } },
    { $group: { 
      _id: '$ipAddress',
      count: { $sum: 1 },
      actions: { $push: '$action' }
    } },
    { $match: { count: { $gt: 5 } } }, // Threshold for suspicious
    { $sort: { count: -1 } }
  ]);
};

// 🔍 Critical Indexes for Production
auditLogSchema.index({ adminId: 1, action: 1, createdAt: -1, isDeleted: 1 });
auditLogSchema.index({ action: 1, createdAt: -1, isDeleted: 1 });
auditLogSchema.index({ targetId: 1, targetModel: 1, isDeleted: 1 });
auditLogSchema.index({ createdAt: -1, isDeleted: 1 });
auditLogSchema.index({ ipAddress: 1, createdAt: -1, isDeleted: 1 });
auditLogSchema.index({ isDeleted: 1, createdAt: 1 }, { expireAfterSeconds: 31536000 }); // TTL for 1 year if needed

// Ensure virtuals are included in toJSON/toObject for API responses
auditLogSchema.set('toJSON', { virtuals: true });
auditLogSchema.set('toObject', { virtuals: true });

export default mongoose.model('AuditLog', auditLogSchema);