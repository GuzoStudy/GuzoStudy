import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import AuditLog from '../models/AuditLog.js';
import { body, validationResult } from 'express-validator';

// Rate limiter for password reset
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many password reset attempts. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Generate JWT
const generateToken = (id, role, expiresIn = '15m') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });

// Generate Refresh Token
const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Send email helper
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USERNAME,
    to,
    subject,
    text,
  });
};

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate valid random password
const generateValidRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
  let password = '';
  const minLength = 8;

  password += 'A'; // Uppercase
  password += 'a'; // Lowercase
  password += '1'; // Number
  password += '@'; // Special character

  for (let i = 4; i < minLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  password = password.split('').sort(() => Math.random() - 0.5).join('');
  return password;
};

// Email validation
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Password validation
const validatePassword = (password) => {
  if (!password) return false;
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
};

// Log action helper
const logAction = async (userId, action, details = {}, req) => {
  await AuditLog.create({
    adminId: null,
    action,
    targetId: userId,
    targetModel: 'User',
    metadata: details,
    ipAddress: req?.ip || 'unknown',
    userAgent: req?.headers['user-agent'] || 'unknown',
    createdBy: userId
  });
};

// Validation for reset password
const resetPasswordValidation = [
  body('newPassword')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
];

// Rate limiters
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 3,
  message: 'Too many OTP requests. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts. Please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, authProvider, providerId } = req.body;

    const allowedRoles = ['student', 'instructor'];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: `Cannot register as '${role}'. Only 'student' or 'instructor' can self-register.`
      });
    }

    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const otpCode = generateOtp();
    const user = new User({
      firstName: firstName || 'Unknown',
      lastName: lastName || 'User',
      email,
      password: authProvider ? undefined : password,
      role,
      isVerified: { verified: false },
      otp: { code: otpCode, expiresAt: Date.now() + 5 * 60 * 1000 },
      authProviders: authProvider ? [{ provider: authProvider, providerId }] : [],
      createdBy: null
    });

    await user.save();  // ✅ schema will validate password here

    await sendEmail(email, 'Verify your account', `Your OTP: ${otpCode}`);
    await logAction(user._id, 'register', { role, authProvider }, req);

    res.status(201).json({ message: 'User registered. Check your email for OTP.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
};


// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      user.otp = user.otp || {};
      user.otp.attempts = (user.otp.attempts || 0) + 1;
      await user.save();
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = { verified: true, token: undefined, expiresAt: undefined };
    user.otp = undefined;
    user.updatedBy = user._id;
    await user.save();

    await logAction(user._id, 'verify_otp', { email: user.email }, req);

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('JWT_SECRET or JWT_REFRESH_SECRET missing');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    const user = await User.findOne({ email, isDeleted: false }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isSuspended) return res.status(403).json({ message: 'Account suspended' });

    if (!user.authProviders.length && !await user.comparePassword(password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified.verified) return res.status(400).json({ message: 'Email not verified' });

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.updatedBy = user._id;
    await user.save();

    await logAction(user._id, 'login', { role: user.role }, req);

    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log('Decoded refresh token:', decoded);
    } catch (err) {
      console.error('JWT verify error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new access token
    const newAccessToken = generateToken(user._id, user.role);

    // Track last update
    user.updatedBy = user._id;
    await user.save({ validateBeforeSave: false });

    // ✅ Log refresh token action in AuditLog
    await AuditLog.create({
      action: 'refresh_token',           // must exist in your enum (which it does)
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      targetId: user._id,
      targetModel: 'User',
      metadata: {
        note: 'User refreshed access token'
      },
      createdBy: user._id,
      updatedBy: user._id
    });

    // Return new access token
    res.json({ token: newAccessToken });

  } catch (err) {
    console.error('Refresh token controller error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newOtp = generateOtp();
    user.otp = { code: newOtp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 };
    user.updatedBy = user._id;
    await user.save();

    await sendEmail(email, 'Resend OTP', `Your new OTP: ${newOtp}`);

    await logAction(user._id, 'resend_otp', { email: user.email }, req);

    res.json({ message: 'New OTP sent to your email' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, { isDeleted: false }).select('-password -otp');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, profilePicture, phone, preferences, learningPreferences, authProviders } = req.body;
    const user = await User.findById(req.user.id, { isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (phone) user.phone = phone;
    if (preferences) user.preferences = preferences;
    if (learningPreferences) user.learningPreferences = learningPreferences;
    if (authProviders) user.authProviders = authProviders;
    user.updatedBy = req.user.id;
    await user.save();

    await logAction(user._id, 'update_profile', {}, req);

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email, isDeleted: false });
    
    // Always return success message to avoid exposing registered emails
    const responseMessage = 'If your email exists in our system, you will receive a password reset link';

    if (!user) {
      return res.json({ message: responseMessage });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    user.updatedBy = user._id;
    await user.save({ validateBeforeSave: false });

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetUrl}`);

    // Log in AuditLog (optional)
    await AuditLog.create({
      action: 'forgot_password', 
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      targetId: user._id,
      targetModel: 'User',
      metadata: { email: user.email },
      createdBy: user._id,
      updatedBy: user._id
    });

    res.json({ message: responseMessage });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: err.message }); // show real error for debugging
  }
};

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body; // must match schema field
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
      isDeleted: false
    }).select('+password +authProviders');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // If social auth exists, ensure email provider is added
    if (user.authProviders?.length) {
      user.authProviders = user.authProviders.filter(p => p.provider !== 'email');
      user.authProviders.push({ provider: 'email', providerId: user.email });
    }

    user.password = password; // matches schema field
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.updatedBy = user._id;

    await user.save({ validateBeforeSave: user.authProviders?.length ? false : true });

    // Log reset password action
    await AuditLog.create({
      action: 'reset_password',
      targetId: user._id,
      targetModel: 'User',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: { email: user.email },
      createdBy: user._id,
      updatedBy: user._id
    });

    res.json({ message: 'Password reset successful' });

  } catch (err) {
    console.error('Reset password error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Logout
export const logout = async (req, res) => {
  try {
    await logAction(req.user._id, 'logout', {}, req);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create Admin
export const createAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create admins' });
    }

    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'admin',
      isVerified: { verified: true },
      createdBy: req.user._id
    });
    await user.save();

    await logAction(user._id, 'create_admin', { role: 'admin' }, req);

    res.status(201).json({ message: 'Admin created successfully', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create Superadmin
export const createSuperadmin = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create superadmins' });
    }

    const { firstName, lastName, email, password, secretKey } = req.body; // ✅ include secretKey

    // Check secret key
    if (!secretKey || secretKey !== process.env.SUPERADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid or missing secret key' });
    }

    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'superadmin',
      isVerified: { verified: true },
      createdBy: req.user._id
    });

    await user.save();

    // Optional: log action
    await logAction(user._id, 'create_superadmin', { role: 'superadmin' }, req);

    res.status(201).json({
      message: 'Superadmin created successfully',
      user: { id: user._id, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Create superadmin error:', err);
    res.status(500).json({ message: err.message });
  }
};
