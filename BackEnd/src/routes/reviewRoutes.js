import express from 'express';
import { submitReview, getCourseReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:courseId', protect, authorize('student'), submitReview);
router.get('/:courseId', getCourseReviews);

export default router;