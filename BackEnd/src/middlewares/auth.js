// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog.js'; // For logging auth events

// 🔒 Protect routes (require login)
export const protect = async (req, res, next) => {
  // 🔍 DEBUG: Check JWT_SECRET at runtime
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing in .env');
    return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET is not set' });
  }

  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Validate token structure
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // ✅ Enhanced: Find user and exclude deleted/suspended users
    const user = await User.findById(decoded.id)
      .select('-password -otp -resetToken')
      .where('isDeleted').ne(true); // Exclude deleted users

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // ✅ Enhanced: Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({ 
        message: 'Account suspended. Please contact support.' 
      });
    }

    // ✅ Enhanced: Check email verification (works with your enhanced model)
    if (!user.isVerified?.verified) {
      return res.status(403).json({ 
        message: 'Email not verified. Please check your email.' 
      });
    }

    req.user = user;

    // Log successful auth (low verbosity)
    await AuditLog.create({
      action: 'user_authenticated',
      targetId: user._id,
      targetModel: 'User',
      metadata: { ip: req.ip, userAgent: req.headers['user-agent'] },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      createdBy: user._id
    }).catch(console.error); // Fire-and-forget

    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// 👑 Role-based authorization (case-insensitive)
export const authorize = (...roles) => {
  const allowedRoles = roles.flat().filter(r => typeof r === 'string').map(r => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({
        message: `Access denied: requires [${allowedRoles.join(', ')}]`
      });
    }

    const userRole = req.user.role.trim().toLowerCase();
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied: requires [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
};

// ----------------- EXPORTS FOR COMPATIBILITY -----------------
// Export as 'auth' and 'requireRole' for existing controllers
export const auth = protect;
export const requireRole = authorize;

// ----------------- ROLE SHORTCUTS -----------------
export const studentOnly = authorize('student');
export const instructorOnly = authorize('instructor');
export const adminOnly = authorize('admin', 'superadmin');
export const studentInstructorOnly = authorize('student', 'instructor');
