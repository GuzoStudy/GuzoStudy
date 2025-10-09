// routes/quizRoutes.js
import express from 'express';
import {
  createQuiz,
  getQuizzes,
  getQuiz,
  submitQuiz,
  getUserResults,
  updateQuiz 
} from '../controllers/quizController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// ✅ Instructor/Admin routes
router.post('/', createQuiz);

// ✅ Update quiz (status, title, etc.)
router.patch(
  '/:quizId',
  protect,
  authorize('instructor', 'admin', 'superadmin'),
  param('quizId').isMongoId().withMessage('Valid quiz ID required'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('title').optional().isString().isLength({ min: 5, max: 200 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  updateQuiz
);


// ✅ Public for enrolled users
router.get('/course/:courseId', getQuizzes);
router.get('/:quizId', getQuiz);

// ✅ Student routes
router.post('/:quizId/submit', submitQuiz);
router.get('/results/me', getUserResults);

export default router;
