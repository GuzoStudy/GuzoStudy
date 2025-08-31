import express from 'express';
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  getProfile,
  updateProfile,
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Protected
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Example admin-only
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;
