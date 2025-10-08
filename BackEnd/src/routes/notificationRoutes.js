// routes/notificationRoutes.js
import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteMultipleNotifications
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { query, param, body, validationResult } from 'express-validator';

const router = express.Router();

// 📬 Get notifications with pagination & filters (student/instructor/admin)
router.get(
  '/',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  [
    query('page').optional().isInt({ min: 1 }).default(1),
    query('limit').optional().isInt({ min: 1, max: 50 }).default(10),
    query('read').optional().isBoolean(),
    query('type').optional().isIn(['announcement', 'deadline', 'feedback', 'all'])
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getNotifications
);

// 🔸 Get unread notifications count (e.g. for navbar badge) (student/instructor/admin)
router.get(
  '/unread-count',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  getUnreadCount
);

// ✅ Mark all notifications as read (student/instructor/admin)
router.patch(
  '/mark-all',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  markAllNotificationsRead
);

// ✅ Mark single notification as read (student/instructor/admin)
router.patch(
  '/:notificationId/read',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  param('notificationId').isMongoId().withMessage('Valid notification ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  markNotificationRead
);

// 🗑️ Delete single notification (student/instructor/admin)
router.delete(
  '/:notificationId',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  param('notificationId').isMongoId().withMessage('Valid notification ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  deleteNotification
);

// 🗑️ Bulk delete multiple notifications (student/instructor/admin)
router.delete(
  '/',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  body('ids').isArray({ min: 1 }).withMessage('IDs array required'),
  body('ids.*').isMongoId().withMessage('Valid notification IDs required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  deleteMultipleNotifications
);

export default router;
