// routes/discussionRoutes.js
import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  createDiscussion,
  postReply,
  getDiscussions,
  deleteDiscussion,
  moderateDiscussion
} from '../controllers/discussionController.js';
import { auth, requireRole } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

// ----------------- DISCUSSIONS -----------------

// Middleware to validate request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Create a discussion
router.post(
  '/',
  auth,
  requireRole(['student', 'instructor', 'admin', 'superadmin']),
  [
    body('title').trim().notEmpty().isLength({ min: 5, max: 200 }),
    body('content').trim().notEmpty().isLength({ min: 10, max: 5000 })
  ],
  validate,
  createDiscussion
);

// Post a reply
router.post(
  '/:discussionId/reply',
  auth,
  requireRole(['student', 'instructor', 'admin', 'superadmin']),
  param('discussionId').isMongoId(),
  [
    body('content').trim().notEmpty().isLength({ min: 1, max: 5000 }),
    body('postIndex').optional().isInt({ min: 0 }),
    body('attachments').optional().isArray(),
    body('mentions').optional().isArray()
  ],
  validate,
  postReply
);

// Get discussions
router.get(
  '/',
  auth,
  requireRole(['student', 'instructor', 'admin', 'superadmin']),
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('sort').optional().isIn(['latest', 'oldest', 'active', 'pinned']),
    query('keyword').optional().trim(),
    query('status').optional().isIn(['active', 'resolved', 'all'])
  ],
  validate,
  getDiscussions
);

// Delete discussion (soft delete)
router.delete(
  '/:discussionId',
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('discussionId').isMongoId(),
  body('reason').optional().trim().isLength({ max: 500 }),
  validate,
  deleteDiscussion
);

// Moderate discussion (lock/unlock, resolve/reopen, ban user)
router.put(
  '/:discussionId/moderate',
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('discussionId').isMongoId(),
  [
    body('action').isIn(['lock', 'unlock', 'resolve', 'reopen', 'ban_user']),
    body('userId').if(body('action').equals('ban_user')).isMongoId(),
    body('reason').optional().trim().isLength({ max: 500 })
  ],
  validate,
  moderateDiscussion
);

export default router;
