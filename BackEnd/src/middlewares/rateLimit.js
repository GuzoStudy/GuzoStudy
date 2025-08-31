// src/middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

// OTP routes limiter
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { message: 'Too many OTP requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3,
  message: { message: 'Too many password reset requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, // ⬅️ 10 login attempts in 15 minutes
  message: { message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // ⬅️ Only 5 account creations per hour per IP
  message: { message: 'Too many registrations from this IP, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
