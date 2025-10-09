// routes/userRoutes.js
import express from 'express';
import {
  register,
  verifyOtp,
  login,
  refreshToken,
  resendOtp,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  logout,
  otpLimiter,
  loginLimiter, // ✅ ADD THIS IMPORT
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';


const router = express.Router();

/** ============================
 * 📝 Auth Routes
 * ============================ */

// Registration + OTP
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', otpLimiter, resendOtp);

// Login & Refresh
router.post('/login', loginLimiter, login); // ✅ ADD loginLimiter HERE
router.post('/refresh-token', refreshToken);

// Forgot / Reset Password
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Logout
router.post('/logout', protect, logout);

/** ============================
 * 👤 User Profile Routes
 * ============================ */
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
