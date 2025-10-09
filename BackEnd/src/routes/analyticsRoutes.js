// routes/analyticsRoutes.js
import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import { 
  getCourseAnalytics, 
  getInstructorAnalytics, 
  getTopInstructorCourses,
  getInstructorEarnings // Add if exported from controller
} from '../controllers/analyticsController.js';

const router = express.Router();

// ----------------- Course-level Analytics -----------------
// GET /api/analytics/course/:courseId
// Only instructor of course or admin/superadmin
router.get(
  '/course/:courseId',
  protect,
  authorize('instructor', 'admin', 'superadmin'),
  getCourseAnalytics
);

// ----------------- Instructor-wide Analytics -----------------
// GET /api/analytics/instructor
// Only instructor themselves
router.get(
  '/instructor',
  protect,
  authorize('instructor'),
  getInstructorAnalytics
);

// GET /api/analytics/instructor/top-courses
router.get(
  '/instructor/top-courses',
  protect,
  authorize('instructor'),
  getTopInstructorCourses
);

// GET /api/analytics/instructor/earnings
router.get(
  '/instructor/earnings',
  protect,
  authorize('instructor'),
  getInstructorEarnings
);

export default router;
