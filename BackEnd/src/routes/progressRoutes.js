// routes/progressRoutes.js
import express from 'express';
import {
  streamLesson,
  markLessonCompleted,
  getProgress,
  getStudentDashboard
} from '../controllers/progressController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { param, query, validationResult } from 'express-validator';

const router = express.Router();

// ✅ Stream a lesson (students enrolled, instructors/admins)
router.get(
  '/lesson/:lessonId',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  param('lessonId').isMongoId().withMessage('Valid lesson ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  streamLesson
);

// ✅ Mark lesson as completed (students only)
router.put(
  '/lesson/:lessonId/complete',
  protect,
  authorize('student'),
  param('lessonId').isMongoId().withMessage('Valid lesson ID required'),
  query('timeSpent').optional().isFloat({ min: 0 }).withMessage('Time spent must be positive'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  markLessonCompleted
);

// ✅ Get progress for a course (students, instructors, admins)
router.get(
  '/course/:courseId',
  protect,
  authorize('student', 'instructor', 'admin', 'superadmin'),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getProgress
);

// ✅ Student dashboard
router.get(
  '/dashboard',
  protect,
  authorize('student'),
  getStudentDashboard
);

export default router;
