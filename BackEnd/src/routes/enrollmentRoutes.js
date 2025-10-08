// routes/enrollmentRoutes.js
import express from 'express';
import {
  enrollCourse,
  getUserEnrollments,
  getCourseEnrollments,
  getInstructorCourseStats,
  getStudentDashboard,
} from '../controllers/enrollmentController.js';
import { getUpcomingLessons } from '../controllers/courseController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { param, query, validationResult  } from 'express-validator';

const router = express.Router({ mergeParams: true });

// ----------------- ENROLLMENT -----------------

// POST /api/enrollments/enroll/:courseId - Enroll in a course (student only)
router.post(
  '/enroll/:courseId',
  protect,
  authorize('student'),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  enrollCourse
);

// GET /api/enrollments/my-enrollments - Get logged-in user's enrollments (student only)
router.get(
  '/my-enrollments',
  protect,
  authorize('student'),
  query('page').optional().isInt({ min: 1 }).default(1),
  query('limit').optional().isInt({ min: 1, max: 50 }).default(10),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getUserEnrollments
);

// GET /api/enrollments/course/:courseId - Get enrollments for a course (instructor/admin/superadmin)
router.get(
  '/course/:courseId',
  protect,
  authorize('instructor', 'admin', 'superadmin'),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  query('page').optional().isInt({ min: 1 }).default(1),
  query('limit').optional().isInt({ min: 1, max: 50 }).default(10),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getCourseEnrollments
);

// ----------------- DASHBOARD & STATS -----------------

// GET /api/enrollments/dashboard - Student dashboard (enrolled courses, progress, quiz scores, certificates) (student only)
router.get(
  '/dashboard',
  protect,
  authorize('student'),
  getStudentDashboard
);

// GET /api/enrollments/course/:courseId/stats - Instructor course stats (instructor/admin/superadmin)
router.get(
  '/course/:courseId/stats',
  protect,
  authorize('instructor', 'admin', 'superadmin'),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getInstructorCourseStats
);

// GET /api/enrollments/upcoming-lessons - Upcoming lessons for student (student only)
router.get(
  '/upcoming-lessons',
  protect,
  authorize('student'),
  getUpcomingLessons
);

export default router;
