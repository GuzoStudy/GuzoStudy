import express from 'express';
import { getCourseAnalytics, getInstructorAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/course/:courseId', protect, authorize('instructor', 'admin'), getCourseAnalytics);
router.get('/instructor', protect, authorize('instructor'), getInstructorAnalytics);

export default router;