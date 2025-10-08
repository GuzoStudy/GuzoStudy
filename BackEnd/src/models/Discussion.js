import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true,
      trim: true
    },
    contentHtml: { type: String }, // Rich text version
    attachments: [{ // File attachments
      filename: { type: String },
      url: { type: String },
      mimeType: { type: String }
    }],
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date 
    },
    isEdited: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    mentions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, notified: { type: Boolean, default: false } }],
    analytics: {
      likeCount: { type: Number, default: 0 },
      reportCount: { type: Number, default: 0 }
    }
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true,
      trim: true
    },
    contentHtml: { type: String }, // Rich text version
    attachments: [{ // File attachments
      filename: { type: String },
      url: { type: String },
      mimeType: { type: String }
    }],
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date 
    },
    isEdited: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    replies: [replySchema],
    mentions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, notified: { type: Boolean, default: false } }],
    analytics: {
      likeCount: { type: Number, default: 0 },
      replyCount: { type: Number, default: 0 },
      reportCount: { type: Number, default: 0 }
    }
  },
  { _id: true }
);

const discussionSchema = new mongoose.Schema(
  {
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    section: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Section' 
    },
    lesson: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson' 
    },
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    posts: [postSchema],
    isPinned: { 
      type: Boolean, 
      default: false 
    },
    isLocked: { 
      type: Boolean, 
      default: false 
    },
    reportCount: { 
      type: Number, 
      default: 0 
    },
    // Discussion status for workflow management
    status: {
      type: String,
      enum: ['active', 'archived', 'resolved', 'duplicate'],
      default: 'active',
      index: true
    },
    // Add moderation metadata
    moderation: {
      flagged: { type: Boolean, default: false },
      flaggedAt: { type: Date },
      reviewed: { type: Boolean, default: false },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewNotes: { type: String },
      autoFlagged: { type: Boolean, default: false } // AI/content filter flagged
    },
    mentions: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notified: { type: Boolean, default: false }
    }],

    // Add ban tracking
    bannedUsers: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      bannedAt: { type: Date, default: Date.now },
      reason: { type: String }
    }],
    // Track discussion activity
    analytics: {
      viewCount: { type: Number, default: 0 },
      replyCount: { type: Number, default: 0 }, // Cached for performance
      lastActivityAt: { type: Date, default: Date.now },
      participantCount: { type: Number, default: 1 } // Unique participants
    },

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Audit fields for Admin oversight
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Add analytics to post/reply schemas
postSchema.add({
  analytics: {
    likeCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 }
  }
});

replySchema.add({
  analytics: {
    likeCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 }
  }
});

// Add mentions to post/reply schemas
postSchema.add({
  mentions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, notified: { type: Boolean, default: false } }]
});

replySchema.add({
  mentions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, notified: { type: Boolean, default: false } }]
});

// Support rich text and media in post/reply
postSchema.add({
  contentHtml: { type: String }, // Rich text version
  attachments: [{ // File attachments
    filename: { type: String },
    url: { type: String },
    mimeType: { type: String }
  }]
});

replySchema.add({
  contentHtml: { type: String },
  attachments: [{
    filename: { type: String },
    url: { type: String },
    mimeType: { type: String }
  }]
});

// Pre-save hook for discussion: Update analytics, audit
discussionSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Validate no banned users include creator
    if (this.bannedUsers.some(ban => ban.user.toString() === this.createdBy.toString())) {
      return next(new Error('Creator cannot be banned from their own discussion'));
    }
  }
  // Update reply count
  this.analytics.replyCount = this.posts.reduce((total, post) => {
    const activeReplies = post.replies.filter(reply => !reply.isDeleted);
    return total + activeReplies.length + (post.isDeleted ? 0 : 1); // +1 for post if active
  }, 0);
  
  // Update last activity
  const allPosts = this.posts.flatMap(post => [
    post.isDeleted ? null : post,
    ...post.replies.filter(r => !r.isDeleted)
  ]).filter(Boolean);
  
  if (allPosts.length > 0) {
    this.analytics.lastActivityAt = new Date(Math.max(...allPosts.map(p => p.updatedAt || p.createdAt).map(d => d.getTime())));
  } else {
    this.analytics.lastActivityAt = this.createdAt;
  }

  // Update participant count (unique users)
  const participants = new Set();
  this.posts.forEach(post => {
    if (!post.isDeleted) participants.add(post.user.toString());
    post.replies.forEach(reply => {
      if (!reply.isDeleted) participants.add(reply.user.toString());
    });
  });
  this.analytics.participantCount = participants.size;

  if (this.isModified()) {
    this.updatedBy = this.updatedBy || this.createdBy;
  }
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.deletedAt = new Date();
  }
  next();
});

// Post-save hook: Trigger notifications for mentions, reports
discussionSchema.post('save', async function(doc) {
  if (this.isNew || this.isModified('posts')) {
    // Notify mentions
    const allMentions = [
      ...doc.mentions,
      ...doc.posts.flatMap(p => [...p.mentions, ...p.replies.flatMap(r => r.mentions)])
    ].filter(m => !m.notified);
    const Notification = mongoose.model('Notification');
    for (const mention of allMentions) {
      await new Notification({
        user: mention.user,
        type: 'feedback',
        title: 'New Mention',
        message: `You have been mentioned in a discussion: "${doc.title}"`,
        related: doc._id,
        relatedModel: 'Discussion'
      }).save();
      // Mark as notified
      mention.notified = true;
    }
    await doc.save();

    // If flagged, notify admin
    if (doc.moderation.flagged && !doc.moderation.reviewed) {
      await new Notification({
        user: null, // Broadcast to admins
        recipientRole: 'admin',
        type: 'alert',
        title: 'Flagged Discussion',
        message: `Discussion "${doc.title}" has been flagged for review.`,
        related: doc._id,
        relatedModel: 'Discussion'
      }).save();
    }

    // Log audit
    if (mongoose.models.Auditlog) {
      await mongoose.model('Auditlog').create({
        user: doc.updatedBy || doc.createdBy,
        action: 'discussion_update',
        resourceId: doc._id,
        details: { status: doc.status, postsCount: doc.analytics.replyCount }
      });
    }
  }
});

// Virtual: Active posts count (for student dashboard)
discussionSchema.virtual('activePostsCount').get(function() {
  return this.posts.filter(post => !post.isDeleted).length;
});

// Virtual: Total replies (active only)
discussionSchema.virtual('totalReplies').get(function() {
  return this.posts.reduce((total, post) => {
    return total + post.replies.filter(r => !r.isDeleted).length;
  }, 0);
});

// Virtual: Has unread replies (for notifications)
discussionSchema.virtual('hasUnread').get(async function() {
  // Compare last read timestamp from user; placeholder
  return false;
});

// Static: Get discussions for course/lesson (for student dashboard)
discussionSchema.statics.getForCourse = async function(courseId, options = {}) {
  return this.find({ 
    course: courseId, 
    status: 'active', 
    isDeleted: false,
    ...(options.lessonId && { lesson: options.lessonId }),
    isLocked: false
  })
    .populate('createdBy', 'fullName profilePicture')
    .sort({ isPinned: -1, lastActivityAt: -1 })
    .limit(options.limit || 20);
};

// Static: Get flagged discussions for admin moderation
discussionSchema.statics.getFlagged = async function() {
  return this.find({ 
    $or: [{ reportCount: { $gt: 0 } }, { 'moderation.flagged': true }], 
    isDeleted: false 
  })
    .populate('course createdBy moderation.reviewedBy')
    .sort({ reportCount: -1, updatedAt: -1 });
};

// Static: Search discussions by title/content (for community search)
discussionSchema.statics.search = async function(query, courseId) {
  return this.find({ 
    course: courseId, 
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { 'posts.content': { $regex: query, $options: 'i' } }
    ],
    isDeleted: false 
  })
    .sort({ createdAt: -1 });
};

// 🔍 Index for fast lookups in course/lesson discussions
discussionSchema.index({ course: 1, lesson: 1, createdAt: -1, isDeleted: 1 });
// Add these for production performance
discussionSchema.index({ course: 1, isPinned: -1, createdAt: -1, isDeleted: 1 }); // Course discussions
discussionSchema.index({ lesson: 1, createdAt: -1, isDeleted: 1 }); // Lesson discussions  
discussionSchema.index({ reportCount: -1, createdAt: -1, isDeleted: 1 }); // Moderation queue
discussionSchema.index({ createdBy: 1, createdAt: -1, isDeleted: 1 }); // User activity
discussionSchema.index({ status: 1, isDeleted: 1 }); // Active discussions
discussionSchema.index({ 'analytics.lastActivityAt': -1 }); // Recent activity

// Ensure virtuals are included in toJSON/toObject for API responses
discussionSchema.set('toJSON', { virtuals: true });
discussionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Discussion', discussionSchema);
