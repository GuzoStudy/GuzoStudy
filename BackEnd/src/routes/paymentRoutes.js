import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import { checkout, createCartPayment, verifyPayment, chapaCallback } from '../controllers/paymentController.js';

const router = express.Router();

// Single course checkout
router.post('/checkout', protect, authorize('student'), checkout);

// Cart checkout
router.post('/cart', protect, authorize('student'), createCartPayment);

// Manual verification
router.post('/verify', protect, authorize('student'), verifyPayment);

// Chapa callback (GET)
router.get('/verify/callback', chapaCallback);

export default router;
