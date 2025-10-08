import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  //price: { type: Number, default: 0 },
  //discount: { type: Number, default: 0 },
  // Enhanced (professional):
  pricing: {
    basePrice: { type: Number, required: true, default: 0 },
    currentPrice: { type: Number }, // Auto-calculated
    discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
    isFree: { type: Boolean, default: false },
    currency: { type: String, default: 'ETB' } // International support
  },
  status: { type: String, enum: ['draft', 'pending', 'published', 'rejected'], default: 'draft' }, // Added 'pending', 'rejected' for approvals
  prerequisites: [{ type: String }],
  learningPaths: [{ type: String }],
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: { type: Number, default: 0 },
  thumbnail: {
    url: { type: String }, // Full URL for CDN
    filename: { type: String }, // Original filename
    altText: { type: String } // Accessibility
  },
 
  // Add these for instructor analytics (cached fields)
  cachedEnrollmentCount: { type: Number, default: 0 },
  cachedTotalRevenue: { type: Number, default: 0 },
  cachedCompletionRate: { type: Number, default: 0 }, // Percentage

  moderation: {
    flagged: { type: Boolean, default: false },
    flaggedReason: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String }
  },

  // Add these fields
  slug: { 
    type: String, 
    unique: true,
    required: true,
    lowercase: true 
  }, // For clean URLs: /courses/complete-react-course
  metaDescription: { type: String, maxlength: 160 }, // SEO
  metaKeywords: [{ type: String }], // SEO
  featured: { type: Boolean, default: false }, // Homepage promotion

  // Soft delete fields
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },

  // Audit fields for Admin oversight
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Pre-save hook: Generate slug, calculate currentPrice, set audit
courseSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.createdBy = this.createdBy || this.instructor;
      if (!this.slug) {
        if (!this.title || typeof this.title !== 'string' || this.title.trim().length < 5) {
          return next(new Error('A valid title (5+ characters) is required to generate slug'));
        }
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existing = await mongoose.model('Course').findOne({ slug: this.slug, isDeleted: false });
        if (existing) this.slug += `-${Date.now()}`;
      }
    }
    if (this.pricing.basePrice > 0 && this.pricing.discountPercentage > 0) {
      this.pricing.currentPrice = Math.round(this.pricing.basePrice * (1 - this.pricing.discountPercentage / 100));
    } else {
      this.pricing.currentPrice = this.pricing.basePrice;
    }
    if (this.isModified()) {
      this.updatedBy = this.updatedBy || this.instructor;
    }
    if (this.isModified('isDeleted') && this.isDeleted) {
      this.deletedAt = new Date();
    }
    next();
  } catch (err) {
    console.error('Pre-save hook error:', err);
    next(err);
  }
});

// Post-save hook: Update averageRating, trigger notifications, cache analytics
courseSchema.post('save', async function(doc) {
  if (this.isModified('status')) {
    if (doc.status === 'published') {
      // Notify instructor of approval
      const Notification = mongoose.model('Notification');
      await new Notification({
        user: doc.instructor,
        type: 'course_update',
        title: 'Course Approved',
        message: `Your course "${doc.title}" has been approved and is now live!`,
        related: doc._id,
        relatedModel: 'Course'
      }).save();
    } else if (doc.status === 'rejected') {
      await new Notification({
        user: doc.instructor,
        type: 'alert',
        title: 'Course Rejected',
        message: `Your course "${doc.title}" was rejected. Reason: ${doc.moderation.rejectionReason || 'See notes'}.`,
        related: doc._id,
        relatedModel: 'Course'
      }).save();
    }
  }
  if (this.isModified('reviews') || doc.reviews?.length > 0) {
    // Recalculate averageRating
    const Review = mongoose.model('Review');
    const avg = await Review.aggregate([
      { $match: { _id: { $in: doc.reviews }, isDeleted: false, status: 'active' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    await mongoose.model('Course').findByIdAndUpdate(doc._id, { averageRating: avg[0]?.avgRating || 0 });
  }
  // Cache enrollmentCount
  if (doc.status === 'published') {
    const Enrollment = mongoose.model('Enrollment');
    const count = await Enrollment.countDocuments({ course: doc._id, isDeleted: false, isActive: true });
    await mongoose.model('Course').findByIdAndUpdate(doc._id, { cachedEnrollmentCount: count });
  }
  // Cache totalRevenue and completionRate (run periodically or on enrollment update)
  // Implementation: Use cron job or post-save on Enrollment/Payment
  // Log audit
  if (mongoose.models.AuditLog) {
    await mongoose.model('AuditLog').create({
      user: doc.updatedBy || doc.createdBy,
      action: 'course_update',
      resourceId: doc._id,
      details: { status: doc.status, pricing: doc.pricing }
    });
  }
});

// Virtual: Thumbnail URL
courseSchema.virtual('thumbnailUrl').get(function() {
  if (!this.thumbnail) return null;
  return `${process.env.BASE_URL}/uploads/thumbnails/${this.thumbnail.filename || this.thumbnail}`;
});

// Virtual: Enrollments (for admin analytics)
courseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
  match: { isDeleted: false, isActive: true }
});

// Virtual: Computed total revenue (aggregate from payments/enrollments)
courseSchema.virtual('computedTotalRevenue').get(async function() {
  const Payment = mongoose.model('Payment');
  const revenue = await Payment.aggregate([
    { $match: { course: this._id, status: 'completed', isDeleted: false } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return revenue[0]?.total || 0;
});

// Virtual: Computed completion rate (from enrollments)
courseSchema.virtual('computedCompletionRate').get(async function() {
  const Enrollment = mongoose.model('Enrollment');
  const [total, completed] = await Promise.all([
    Enrollment.countDocuments({ course: this._id, isDeleted: false }),
    Enrollment.countDocuments({ course: this._id, progress: 100, isDeleted: false })
  ]);
  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Static: Get pending courses for admin approval
courseSchema.statics.getPending = async function() {
  return this.find({ status: 'pending', isDeleted: false })
    .populate('instructor', 'fullName email')
    .sort({ createdAt: -1 });
};

// Static: Get flagged courses for moderation
courseSchema.statics.getFlagged = async function() {
  return this.find({ 'moderation.flagged': true, isDeleted: false })
    .populate('instructor moderation.approvedBy')
    .sort({ updatedAt: -1 });
};

// Static: Approve course (update status, notify)
courseSchema.statics.approve = async function(courseId, approverId, notes = '') {
  const course = await this.findByIdAndUpdate(courseId, {
    status: 'published',
    'moderation.approvedBy': approverId,
    'moderation.approvedAt': new Date(),
    'moderation.reviewNotes': notes,
    updatedBy: approverId
  }, { new: true });
  if (!course) throw new Error('Course not found');
  // Trigger notification (as in post-save)
  return course;
};

// Add these for production performance
courseSchema.index({ instructor: 1, status: 1, isDeleted: 1 }); // Instructor dashboards
courseSchema.index({ status: 1, category: 1, isDeleted: 1 }); // Public course listings
courseSchema.index({ tags: 1, isDeleted: 1 }); // Tag-based search
courseSchema.index({ averageRating: -1, isDeleted: 1 }); // Top-rated courses
courseSchema.index({ createdAt: -1, isDeleted: 1 }); // Newest courses
courseSchema.index({ slug: 1, isDeleted: 1 }); // SEO/URL lookups
courseSchema.index({ featured: 1, status: 1, isDeleted: 1 }); // Featured courses

// Ensure virtuals are included in toJSON/toObject for API responses
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

export default mongoose.model('Course', courseSchema);
