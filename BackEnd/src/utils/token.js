// src/utils/token.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' } // long-lived session token
  );
};

export const generateVerificationToken = (payload, type, otp = null) => {
  const otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid 5 mins
  return jwt.sign(
    { ...payload, type, otp, otpExpires },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // verification/reset token valid 15 mins
  );
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.otp && decoded.otpExpires && Date.now() > decoded.otpExpires) {
      return { valid: false, error: 'OTP expired' };
    }

    return { valid: true, decoded, error: null };
  } catch (err) {
    return { valid: false, decoded: null, error: err.message };
  }
};
