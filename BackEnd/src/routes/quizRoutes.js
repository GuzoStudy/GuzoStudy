import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import { createQuiz, getQuizzes, getQuiz, submitQuiz, getUserResults } from '../controllers/quizController.js';

const router = express.Router();

// ✅ Instructor/Admin: create quiz
router.post('/', protect, authorize('instructor', 'admin'), createQuiz);

// ✅ Get all quizzes for a course
router.get('/course/:courseId', protect, getQuizzes);

// ✅ Get single quiz
router.get('/:quizId', protect, getQuiz);

// ✅ Submit quiz
router.post('/:quizId/submit', protect, submitQuiz);

// ✅ Get user's results
router.get('/results/my', protect, getUserResults);

export default router;
