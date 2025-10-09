import express from 'express';
import { submitReview, getCourseReviews, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

// 🔹 Submit a review (only students who are enrolled)
router.post('/:courseId', submitReview);

// 🔹 Get all reviews for a course (anyone can view)
router.get('/:courseId', getCourseReviews);

// 🔹 Update a review (student only, within edit window)
router.put('/:reviewId', updateReview);

// 🔹 Delete a review (self or admin)
router.delete('/:reviewId', deleteReview);

export default router;
