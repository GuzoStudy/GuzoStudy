// models/Certificate.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const certificateSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    enrollment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Enrollment', 
      required: true 
    }, // Link to enrollment for context
    certificateId: { 
      type: String, 
      unique: true, 
      default: () => uuidv4()  // auto-generate unique ID
    },
    issuedAt: { 
      type: Date, 
      default: Date.now 
    },
    score: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    status: { 
      type: String, 
      enum: ['issued', 'revoked', 'suspended'], 
      default: 'issued',
      index: true 
    },
    // Certificate details
    title: { 
      type: String,
      default: 'Certificate of Completion' 
    },
    issuer: { 
      type: String,
      default: process.env.PLATFORM_NAME || 'Learning Platform' 
    },
    signature: { 
      type: String // URL to instructor/admin signature
    },

    // Add expiration (for time-limited credentials)
    expiresAt: { type: Date },
    isExpired: { 
      type: Boolean, 
      default: false 
    },
    // Add verification metadata
    verification: {
      code: { 
        type: String, 
        unique: true,
        default: () => Math.random().toString(36).substr(2, 8).toUpperCase() // 8-char code
      },
      verifiedAt: { type: Date },
      verifiedBy: { type: String }, // IP address or email
      verificationCount: { type: Number, default: 0 }
    },

    // Add QR code support
    qrCodeUrl: { type: String },
    revoked: { type: Boolean, default: false },
    revokedAt: { type: Date },
    revocationReason: { type: String },

    fileUrl: { 
      type: String, 
      trim: true 
    }, // link to generated PDF/image if you generate certs
    verified: { 
      type: Boolean, 
      default: false 
    },
    // For advanced credentialing
    //blockchainHash: { type: String }, // IPFS or blockchain hash
    //digitalSignature: { type: String }, // Cryptographic signature
    //publicUrl: { 
      //type: String,
      //unique: true 
    //}, // Public verification URL like /verify/ABC123

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  { timestamps: true }
);

// Pre-save hook: Generate verification code, check expiration, set audit
certificateSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.createdBy = this.createdBy || this.user;
    // Ensure unique per enrollment
    const existing = await mongoose.model('Certificate').findOne({
      enrollment: this.enrollment,
      isDeleted: false
    });
    if (existing) {
      return next(new Error('Certificate already issued for this enrollment'));
    }
  }
  // Auto-set revoked status
  if (this.revoked && this.status !== 'revoked') {
    this.status = 'revoked';
    this.revokedAt = new Date();
  }
  // Check expiration
  if (this.expiresAt && new Date() > this.expiresAt) {
    this.isExpired = true;
    this.status = 'suspended';
  }
  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.user;
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
  }
  next();
});

// Post-save hook: Trigger notifications, update enrollment
certificateSchema.post('save', async function(doc) {
  if (this.isNew && doc.status === 'issued') {
    // Update enrollment
    const Enrollment = mongoose.model('Enrollment');
    await Enrollment.findByIdAndUpdate(doc.enrollment, { 
      certificateIssued: true,
      completedAt: doc.issuedAt 
    });

    // Trigger certificate notification
    const Notification = mongoose.model('Notification');
    await new Notification({
      user: doc.user,
      type: 'certificate_issued',
      title: 'Certificate Earned!',
      message: `Congratulations! You've earned a certificate for "${doc.course.title}".`,
      related: doc._id,
      relatedModel: 'Certificate'
    }).save();

    // Log audit
    if (mongoose.models.AuditLog) {
      await mongoose.model('AuditLog').create({
        user: doc.user,
        action: 'certificate_issued',
        resourceId: doc._id,
        details: { score: doc.score, course: doc.course }
      });
    }
  }
  if (this.isModified('status')) {
    // Notify on revocation
    if (doc.status === 'revoked') {
      await new Notification({
        user: doc.user,
        type: 'alert',
        title: 'Certificate Revoked',
        message: `Your certificate for "${doc.course.title}" has been revoked. Reason: ${doc.revocationReason || 'Administrative'}.`,
        related: doc._id,
        relatedModel: 'Certificate'
      }).save();
    }
  }
});

// Virtual: Public verification URL
certificateSchema.virtual('publicUrl').get(function() {
  return `/verify/${this.verification.code}`;
});

// Virtual: Full file URL (for download)
certificateSchema.virtual('fullFileUrl').get(function() {
  if (!this.fileUrl) return null;
  return `${process.env.BASE_URL}${this.fileUrl.startsWith('/') ? '' : '/'}${this.fileUrl}`;
});

// Virtual: Populated enrollment details (for student dashboard) - Renamed to avoid conflict
certificateSchema.virtual('enrollmentDetails', {
  ref: 'Enrollment',
  localField: 'enrollment',
  foreignField: '_id',
  populate: { path: 'course', select: 'title' }
});

// Static: Get certificates for user (for student dashboard)
certificateSchema.statics.getForUser = async function(userId) {
  return this.find({ 
    user: userId, 
    status: 'issued', 
    isDeleted: false,
    ...(this.expiresAt && { expiresAt: { $gt: new Date() } })
  })
    .populate('course', 'title thumbnail')
    .sort({ issuedAt: -1 });
};

// Static: Verify certificate by code (for public verification)
certificateSchema.statics.verifyByCode = async function(code) {
  const cert = await this.findOne({ 
    'verification.code': code, 
    status: 'issued', 
    isDeleted: false,
    isExpired: false 
  }).populate('user course', 'fullName title');
  if (cert) {
    cert.verification.verificationCount += 1;
    cert.verification.verifiedAt = new Date();
    cert.verification.verifiedBy = req?.ip || 'unknown'; // From request in controller
    await cert.save();
  }
  return cert;
};

// Static: Revoke certificate (for admin)
certificateSchema.statics.revoke = async function(certId, reason, revokerId) {
  return this.findByIdAndUpdate(certId, {
    status: 'revoked',
    revoked: true,
    revokedAt: new Date(),
    revocationReason: reason,
    updatedBy: revokerId
  }, { new: true });
};

// Prevent duplicate certificates per user+course
certificateSchema.index({ user: 1, course: 1, isDeleted: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

// For fast verification lookups
certificateSchema.index({ 'verification.code': 1 });
certificateSchema.index({ certificateId: 1 });
// Add these for production performance
certificateSchema.index({ user: 1, issuedAt: -1, isDeleted: 1 }); // User dashboard
certificateSchema.index({ course: 1, issuedAt: -1, isDeleted: 1 }); // Course analytics
certificateSchema.index({ status: 1, issuedAt: -1, isDeleted: 1 }); // Admin dashboard
certificateSchema.index({ expiresAt: 1 }); // Expiration checks

// Ensure virtuals are included in toJSON/toObject for API responses
certificateSchema.set('toJSON', { virtuals: true });
certificateSchema.set('toObject', { virtuals: true });

export default mongoose.model('Certificate', certificateSchema);
