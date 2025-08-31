import express from 'express';
import { streamLesson, markLessonCompleted, getProgress } from '../controllers/contentController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/lessons/:lessonId', protect, authorize('student'), streamLesson);
router.post('/lessons/:lessonId/complete', protect, authorize('student'), markLessonCompleted);
router.get('/progress/:courseId', protect, authorize('student'), getProgress);

export default router;