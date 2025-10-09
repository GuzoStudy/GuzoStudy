import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'My LMS Platform',
    },
    logo: {
      type: String, // path or URL
      validate: {
        validator: function(v) {
          if (!v) return true;
          // Allow both URLs and relative paths
          return /^https?:\/\//.test(v) || /^\/uploads\//.test(v);
        },
        message: 'Logo must be a valid URL or upload path'
      }
    },
    favicon: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^https?:\/\//.test(v) || /^\/uploads\//.test(v);
        },
        message: 'Favicon must be a valid URL or upload path'
      }
    },
    theme: {
      primaryColor: { type: String, default: '#3B82F6' }, // Tailwind blue-500
      secondaryColor: { type: String, default: '#1E293B' },
      darkMode: { type: Boolean, default: false },
    },
    contactEmail: {
      type: String,
      default: 'support@example.com',
    },
    // Enhanced email templates with subject lines and HTML support
    emailTemplates: {
      welcome: {
        subject: { type: String, default: 'Welcome to {{siteName}}!' },
        text: { type: String, default: 'Welcome to our platform, {{name}}!' },
        html: { type: String } // Rich HTML templates
      },
      passwordReset: {
        subject: { type: String, default: 'Password Reset Request' },
        text: { type: String, default: 'Click here to reset your password: {{link}}' },
        html: { type: String }
      },
      courseApproved: {
        subject: { type: String, default: 'Course Approved: {{title}}' },
        text: { type: String, default: 'Your course "{{title}}" has been approved.' },
        html: { type: String }
      },
      newCourseAnnouncement: {
        subject: { type: String, default: 'New Course Available: {{title}}' },
        text: { type: String, default: 'A new course "{{title}}" is live!' },
        html: { type: String }
      },
      enrollmentConfirmation: {
        subject: { type: String, default: 'Enrollment Confirmed' },
        text: { type: String, default: 'You have been enrolled in {{courseTitle}}' },
        html: { type: String }
      },
      // Add more templates as needed
      instructorFeedback: {
        subject: { type: String, default: 'Feedback on Your Course' },
        text: { type: String, default: 'You have received feedback on {{courseTitle}}' },
        html: { type: String }
      },
      deadlineReminder: {
        subject: { type: String, default: 'Upcoming Deadline: {{title}}' },
        text: { type: String, default: 'Reminder: {{title}} is due soon.' },
        html: { type: String }
      }
    },
    // Add internationalization support
    i18n: {
      defaultLanguage: { type: String, default: 'en' },
      supportedLanguages: [{ type: String, default: ['en', 'es', 'fr'] }],
      autoDetectLanguage: { type: Boolean, default: true }
    },
    // Add localized site names
    siteNames: {
      en: { type: String, default: 'My LMS Platform' },
      es: { type: String },
      fr: { type: String }
      // Add more as needed
    },
    // Enhanced security settings
    security: {
      allowRegistrations: { type: Boolean, default: true },
      requireEmailVerification: { type: Boolean, default: true },
      maxLoginAttempts: { type: Number, default: 5 },
      lockoutDuration: { type: Number, default: 30 }, // minutes
      passwordPolicy: {
        minLength: { type: Number, default: 8 },
        requireUppercase: { type: Boolean, default: true },
        requireNumbers: { type: Boolean, default: true },
        requireSpecialChars: { type: Boolean, default: false },
        expiryDays: { type: Number, default: 0 } // 0 = never expires
      },
      sessionTimeout: { type: Number, default: 24 }, // hours
      twoFactorAuth: { type: Boolean, default: false },
      autoBackup: { type: Boolean, default: false },
      backupFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'weekly',
      },
      backupRetention: { type: Number, default: 30 } // days to keep backups
    },
    // Add performance settings
    performance: {
      cacheEnabled: { type: Boolean, default: true },
      cacheTTL: { type: Number, default: 3600 }, // seconds
      cdnEnabled: { type: Boolean, default: false },
      cdnBaseUrl: { type: String },
      imageOptimization: { type: Boolean, default: true },
      lazyLoading: { type: Boolean, default: true }
    },
    // Add business settings
    business: {
      currency: { type: String, default: 'USD' },
      taxRate: { type: Number, default: 0 },
      instructorCommission: { type: Number, default: 70 }, // percentage
      refundPolicyDays: { type: Number, default: 14 },
      subscriptionEnabled: { type: Boolean, default: false },
      freeTrialDays: { type: Number, default: 7 }
    },
    // Add analytics integration
    analytics: {
      googleAnalyticsEnabled: { type: Boolean, default: false },
      googleAnalyticsId: { type: String },
      facebookPixelEnabled: { type: Boolean, default: false },
      facebookPixelId: { type: String },
      hotjarEnabled: { type: Boolean, default: false },
      hotjarId: { type: String }
    },
    // Role & permission access control
    accessControl: {
      student: {
        canComment: { type: Boolean, default: true },
        canDownloadCertificates: { type: Boolean, default: true },
        canViewAnalytics: { type: Boolean, default: false }
      },
      instructor: {
        canCreateCourses: { type: Boolean, default: true },
        requiresApproval: { type: Boolean, default: true },
        canManageStudents: { type: Boolean, default: false }
      },
      admin: {
        canManageSettings: { type: Boolean, default: true },
        canViewRevenue: { type: Boolean, default: true },
        canApproveCourses: { type: Boolean, default: true }
      },
      superadmin: {
        canManageAll: { type: Boolean, default: true }
      }
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Add pre-save validation
siteSettingSchema.pre('save', function (next) {
  // Ensure only one site settings document exists
  if (this.isNew) {
    mongoose.model('SiteSetting').countDocuments().then(count => {
      if (count > 0) {
        throw new Error('Only one SiteSetting document is allowed');
      }
      next();
    }).catch(err => next(err));
  } else {
    next();
  }
});

// Add a static method to get the single instance
siteSettingSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Add this for audit and admin dashboards
siteSettingSchema.index({ updatedBy: 1, updatedAt: -1 });

export default mongoose.model('SiteSetting', siteSettingSchema);