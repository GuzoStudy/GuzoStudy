// routes/paymentRoutes.js
import express from 'express';
import {
  checkout,
  createCartPayment,
  verifyPayment,
  chapaCallback,
  getInstructorEarnings,
  getMyPayments
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// ----------------- Student Payments -----------------
// GET /api/payments/my - Get all payments of logged-in student (student only)
router.get(
  '/my',
  protect,
  authorize('student'),
  getMyPayments
);

// ----------------- Checkout -----------------
// POST /api/payments/checkout - Initialize payment for a single course (student only)
router.post(
  '/checkout',
  protect,
  authorize('student'),
  [
    body('courseId').isMongoId().withMessage('Valid course ID required'),
    body('coupon').optional().trim()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  checkout
);

// POST /api/payments/cart - Initialize payment for multiple courses (cart) (student only)
router.post(
  '/cart',
  protect,
  authorize('student'),
  [
    body('courseIds').isArray({ min: 1 }).withMessage('At least one course required'),
    body('courseIds.*').isMongoId().withMessage('Valid course IDs required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createCartPayment
);

// ----------------- Verification -----------------
// POST /api/payments/verify - Manual verification (called from frontend after payment) (student/admin)
router.post(
  '/verify',
  protect,
  authorize('student', 'admin', 'superadmin'),
  body('tx_ref').trim().notEmpty().withMessage('Transaction reference required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  verifyPayment
);

// GET /api/payments/verify/callback - Chapa callback (public webhook)
router.get('/verify/callback', chapaCallback);

// ----------------- Instructor Earnings -----------------
// GET /api/payments/instructor/earnings - Get total earnings for the logged-in instructor (instructor only)
router.get(
  '/instructor/earnings',
  protect,
  authorize('instructor'),
  getInstructorEarnings
);

export default router;
