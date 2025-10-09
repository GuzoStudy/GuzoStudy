// controllers/notificationController.js
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { body, validationResult, param, query } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware
import AuditLog from '../models/AuditLog.js';
import sendEmail from "../utils/email.js";
import mongoose from "mongoose";

/**
 * 🔹 Create notification(s) (internal use - expanded for prompt features)
 * @param {string|array} userIds - Single userId or array of userIds
 * @param {string} type - e.g., 'announcement', 'deadline', 'feedback'
 * @param {string} message
 * @param {string} relatedId
 * @param {string} relatedModel
 * @param {string} recipientRole - 'student', 'instructor', 'admin', 'all'
 */
export const createNotification = async (
  userIds,
  type,
  message,
  relatedId,
  relatedModel,
  recipientRole = "all"
) => {
  try {
    if (!Array.isArray(userIds)) userIds = [userIds];

    const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (!validUserIds.length) return null;

    // Expand types for prompt: announcement (new courses), deadline (reminders), feedback (instructor)
    const validTypes = ['announcement', 'deadline', 'feedback', 'general', 'course_update', 'payment', 'payment_success', 'system', 'reminder', 'alert', 'certificate_issued','enrollment'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid notification type: ${type}`);
    }

    const notifications = await Notification.insertMany(
      validUserIds.map(userId => ({
        user: userId,
        type,
        message: message.trim(),
        relatedId: mongoose.Types.ObjectId.isValid(relatedId) ? relatedId : undefined,
        relatedModel: relatedModel || undefined,
        recipientRole,
        createdBy: userIds[0] // Batch creator
      }))
    );

    // Add notification references to users & send emails asynchronously
    for (const userId of validUserIds) {
      const user = await User.findById(userId, { isDeleted: false });
      if (!user) continue;

      user.notifications = user.notifications || [];
      user.notifications.push(...notifications.map(n => n._id));
      await user.save();

      // Respect preferences
      if (user.preferences.notificationsEnabled && user.email) {
        sendEmail(user.email, `New ${type} Notification`, message).catch(err =>
          console.error("Email sending failed:", err)
        );
      }
    }

    return notifications;
  } catch (err) {
    console.error("❌ Error creating notification:", err.message);
    throw err;
  }
};

// ✅ Get notifications for logged-in user (supports pagination, read/unread filtering)
export const getNotifications = [
  auth,
  query('page').optional().isInt({ min: 1 }).default(1),
  query('limit').optional().isInt({ min: 1, max: 50 }).default(10),
  query('read').optional().isBoolean(),
  query('type').optional().isIn(['announcement', 'deadline', 'feedback', 'all']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { page = 1, limit = 10, read, type } = req.query;
    const filter = {
      user: req.user._id,
      isDeleted: false,
      expiresAt: { $gt: new Date() }
    };

    // Recipient role broadcasts
    if (req.user.role === 'student' || req.user.role === 'instructor') {
      filter.$or = [
        { user: req.user._id },
        { recipientRole: req.user.role },
        { recipientRole: 'all' }
      ];
      delete filter.user;
    }

    if (read === 'true') filter.read = true;
    if (read === 'false') filter.read = false;
    if (type !== 'all') filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Notification.countDocuments(filter);

    const notifications = await Notification.find(filter)
      .populate('relatedId', 'title name price') // Dynamic populate based on model
      .sort({ createdAt: -1, priority: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Audit log (optional for high-traffic)
    await AuditLog.create({
      action: 'notifications_viewed',
      targetId: req.user._id,
      targetModel: 'User',
      metadata: { count: notifications.length, filters: { read, type } },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      createdBy: req.user._id
    });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      notifications
    });
  }
];

// 🔹 Mark single notification as read
export const markNotificationRead = [
  auth,
  param('notificationId').isMongoId().withMessage('Valid notification ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { notificationId } = req.params;

    try {
      const notification = await Notification.findOneAndUpdate(
        { 
          _id: notificationId, 
          $or: [
            { user: req.user._id },
            { recipientRole: req.user.role },
            { recipientRole: 'all' }
          ],
          isDeleted: false 
        },
        { read: true, updatedBy: req.user._id },
        { new: true }
      );

      if (!notification) return res.status(404).json({ message: 'Not found or unauthorized' });

      res.json({ message: 'Marked as read', notification });
    } catch (err) {
      console.error('Error marking notification read:', err);
      res.status(500).json({ message: 'Failed to mark as read' });
    }
  }
];

// 🔹 Mark all as read
export const markAllNotificationsRead = [
  auth,
  async (req, res) => {
    try {
      const filter = {
        $or: [
          { user: req.user._id },
          { recipientRole: req.user.role },
          { recipientRole: 'all' }
        ],
        read: false,
        isDeleted: false
      };

      const result = await Notification.updateMany(filter, { 
        read: true, 
        updatedBy: req.user._id 
      });

      res.json({ message: `Marked ${result.modifiedCount} notifications as read` });
    } catch (err) {
      console.error('Error marking all notifications read:', err);
      res.status(500).json({ message: 'Failed to mark all as read' });
    }
  }
];

// 🔹 Delete notification
export const deleteNotification = [
  auth,
  param('notificationId').isMongoId().withMessage('Valid notification ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { notificationId } = req.params;

    try {
      const notification = await Notification.findOneAndUpdate({
        _id: notificationId,
        $or: [
          { user: req.user._id },
          { recipientRole: req.user.role },
          { recipientRole: 'all' }
        ],
        isDeleted: false
      }, {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: req.user._id
      }, { new: true });

      if (!notification) return res.status(404).json({ message: 'Not found or unauthorized' });

      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error('Error deleting notification:', err);
      res.status(500).json({ message: 'Failed to delete' });
    }
  }
];

// 🔹 Delete multiple notifications
export const deleteMultipleNotifications = [
  auth,
  body('ids').isArray({ min: 1 }).withMessage('IDs array required'),
  body('ids.*').isMongoId().withMessage('Valid notification IDs required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { ids } = req.body;

    try {
      const filter = {
        _id: { $in: ids },
        $or: [
          { user: req.user._id },
          { recipientRole: req.user.role },
          { recipientRole: 'all' }
        ],
        isDeleted: false
      };

      const result = await Notification.updateMany(filter, {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: req.user._id
      });

      res.json({ message: `Deleted ${result.modifiedCount} notifications successfully` });
    } catch (err) {
      console.error('Error deleting multiple notifications:', err.message);
      res.status(500).json({ message: 'Failed to delete notifications' });
    }
  }
];

// 🔹 Get count of unread notifications
export const getUnreadCount = [
  auth,
  async (req, res) => {
    try {
      const filter = {
        $or: [
          { user: req.user._id },
          { recipientRole: req.user.role },
          { recipientRole: 'all' }
        ],
        read: false,
        isDeleted: false,
        expiresAt: { $gt: new Date() }
      };

      const count = await Notification.countDocuments(filter);

      res.json({ unreadCount: count });
    } catch (err) {
      console.error('Error fetching unread count:', err.message);
      res.status(500).json({ message: 'Failed to fetch unread notifications count' });
    }
  }
];
