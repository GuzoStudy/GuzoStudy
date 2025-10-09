// controllers/discussionController.js
import mongoose from 'mongoose';
import { validationResult, param, body } from 'express-validator';
import Discussion from '../models/Discussion.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import AuditLog from '../models/AuditLog.js';
import { createNotification } from './notificationController.js';
import { auth, requireRole } from '../middlewares/auth.js';

// Utility: validate request
const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

// ✅ Create Discussion
export const createDiscussion = async (req, res) => {
  if (!validateRequest(req, res)) return;

  const { courseId } = req.params;
  const { title, content } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Students must be enrolled
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
        isActive: true,
        isDeleted: false
      });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const discussion = await Discussion.create({
      course: courseId,
      user: req.user._id,
      title,
      content,
      createdBy: req.user._id
    });

    await AuditLog.create({
      action: 'discussion_created',
      targetId: discussion._id,
      targetModel: 'Discussion',
      metadata: { course: courseId },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      createdBy: req.user._id
    });

    res.status(201).json(discussion);
  } catch (err) {
    console.error('Create Discussion Error:', err);
    res.status(500).json({ message: err.message });
  }
};
// POST reply to a discussion
export const postReply = [
  auth,
  requireRole(['student', 'instructor', 'admin', 'superadmin']),
  param('discussionId').isMongoId(),
  body('content').trim().notEmpty().isLength({ min: 1, max: 5000 }),
  body('postIndex').optional().isInt({ min: 0 }),
  body('attachments').optional().isArray(),
  body('mentions').optional().isArray(),
  async (req, res) => {
    if (!validateRequest(req, res)) return;

    const { discussionId } = req.params;
    const { content, postIndex = 0, attachments = [], mentions = [] } = req.body;

    try {
      const discussion = await Discussion.findOne({ _id: discussionId, isDeleted: false });
      if (!discussion) return res.status(404).json({ message: 'Discussion not found' });
      if (discussion.isLocked) return res.status(403).json({ message: 'Discussion is locked' });

      // Access check for students
      if (req.user.role === 'student') {
        const enrolled = await Enrollment.findOne({ 
          user: req.user._id, 
          course: discussion.course, 
          isActive: true, 
          paymentStatus: 'completed' 
        });
        if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      // Check banned users
      if (discussion.bannedUsers?.some(b => b.user.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: 'Banned from discussion' });
      }

      // Validate mentions
      const validMentions = [];
      if (mentions.length > 0) {
        const users = await User.find({ _id: { $in: mentions } });
        users.forEach(u => validMentions.push({ user: u._id, notified: false }));
      }

      // If no posts exist, create the first post
      if (discussion.posts.length === 0) {
        discussion.posts.push({
          user: req.user._id,
          content,
          attachments,
          mentions: validMentions,
          analytics: { replyCount: 0 },
          replies: [],
          createdAt: new Date()
        });
      } else {
        // Validate postIndex
        if (postIndex >= discussion.posts.length) {
          return res.status(400).json({ message: 'Invalid post index' });
        }

        // Add reply to the specified post
        const post = discussion.posts[postIndex];
        post.replies.push({ user: req.user._id, content, attachments, mentions: validMentions, createdAt: new Date() });
        post.analytics.replyCount += 1;
      }

      discussion.updatedBy = req.user._id;
      discussion.analytics = discussion.analytics || {};
      discussion.analytics.lastActivityAt = new Date();

      await discussion.save();

      // Notify discussion creator and post author
      const notifyIds = new Set();
      if (discussion.createdBy.toString() !== req.user._id.toString()) notifyIds.add(discussion.createdBy.toString());
      if (discussion.posts[postIndex]?.user.toString() !== req.user._id.toString()) notifyIds.add(discussion.posts[postIndex].user.toString());
      for (const id of notifyIds) {
        await createNotification(id, 'feedback', `New reply in "${discussion.title}"`, discussion._id, 'Discussion');
      }

      // Notify mentions
      for (const m of validMentions) {
        await createNotification(m.user, 'feedback', `You were mentioned in "${discussion.title}"`, discussion._id, 'Discussion');
      }

      res.json({ message: 'Reply posted successfully', discussion });

    } catch (err) {
      console.error('Post Reply Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

export const getDiscussions = async (req, res) => {
  if (!validateRequest(req, res)) return;

  const { courseId } = req.params;
  const { page = 1, limit = 10, sort = 'latest', keyword, status = 'all' } = req.query;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role === 'student') {
      const enrolled = await Enrollment.findOne({ user: req.user._id, course: courseId, isActive: true });
      if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const match = { course: courseId, isDeleted: false };
    if (status !== 'all') match.status = status;
    if (keyword) match.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { 'posts.content': { $regex: keyword, $options: 'i' } }
    ];

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'active') sortOption = { 'analytics.lastActivityAt': -1 };
    if (sort === 'pinned') sortOption = { isPinned: -1, 'analytics.lastActivityAt': -1 };

    const discussions = await Discussion.find(match)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('posts.user', 'name email');

    const total = await Discussion.countDocuments(match);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      discussions
    });

  } catch (err) {
    console.error('Get Discussions Error:', err);
    res.status(500).json({ message: err.message });
  }
};
export const moderateDiscussion = async (req, res) => {
  if (!validateRequest(req, res)) return;

  const { discussionId } = req.params;
  const { action, userId, reason } = req.body;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion || discussion.isDeleted) return res.status(404).json({ message: 'Discussion not found' });

    // Handle ban user
    if (action === 'ban_user') {
      discussion.bannedUsers = discussion.bannedUsers || [];
      discussion.bannedUsers.push({
        user: userId,
        reason: reason || 'No reason provided',
        bannedAt: new Date(),
        bannedBy: req.user._id
      });
      await createNotification(userId, 'alert', `You were banned from "${discussion.title}". Reason: ${reason || 'See notes'}.`, discussionId, 'Discussion');
    }

    if (action === 'lock') {
      discussion.isLocked = true;
      discussion.lockedBy = req.user._id;
      discussion.lockedAt = new Date();
      discussion.lockReason = reason || '';
    } else if (action === 'unlock') {
      discussion.isLocked = false;
      discussion.lockedBy = undefined;
      discussion.lockedAt = undefined;
      discussion.lockReason = '';
    } else if (action === 'resolve') {
      discussion.status = 'resolved';
      discussion.resolvedBy = req.user._id;
      discussion.resolvedAt = new Date();
      discussion.resolutionNotes = reason || '';
    } else if (action === 'reopen') {
      discussion.status = 'active';
      discussion.resolvedBy = undefined;
      discussion.resolvedAt = undefined;
      discussion.resolutionNotes = '';
    }

    discussion.updatedBy = req.user._id;
    await discussion.save();

    res.json({ message: `Discussion ${action}ed successfully`, discussion });
  } catch (err) {
    console.error('Moderate Discussion Error:', err);
    res.status(500).json({ message: err.message });
  }
};
export const deleteDiscussion = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('discussionId').isMongoId(),
  body('reason').optional().trim().isLength({ max: 500 }),
  async (req, res) => {
    if (!validateRequest(req, res)) return;

    const { discussionId } = req.params;
    const { reason } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const discussion = await Discussion.findById(discussionId).session(session).populate('course');
      if (!discussion || discussion.isDeleted) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Discussion not found' });
      }

      const course = discussion.course;
      if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: 'Not authorized to delete this discussion' });
      }

      discussion.isDeleted = true;
      discussion.deletedAt = new Date();
      discussion.deletedBy = req.user._id;
      discussion.deletionReason = reason || '';
      await discussion.save({ session });

      await AuditLog.create([{
        adminId: req.user._id,
        action: 'discussion_deleted',
        targetId: discussionId,
        targetModel: 'Discussion',
        metadata: { course: course._id, reason },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.json({ message: 'Discussion deleted successfully' });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error('Delete Discussion Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];
