// controllers/superadminController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import AuditLog from '../models/AuditLog.js';

/** ============================
 * 👑 Create Superadmin (superadmin only)
 * ============================ */
export const createSuperadmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, secretKey } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !secretKey) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password strength (from userController utilities)
    const validatePassword = (pwd) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(pwd);
      const hasLowerCase = /[a-z]/.test(pwd);
      const hasNumbers = /\d/.test(pwd);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
      return pwd.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      });
    }

    // Extra security: require a secret key to prevent accidental creation
    if (secretKey !== process.env.SUPERADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    // Check if email already exists (active only)
    const existing = await User.findOne({ email, isDeleted: false });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const superadmin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'superadmin',
      isVerified: { verified: true },
      createdBy: req.user._id // The current superadmin creating this
    });

    await superadmin.save();

    // Log action in AuditLog
    await AuditLog.create({
      adminId: req.user._id, // the superadmin performing this action
      action: 'create_superadmin',
      targetId: superadmin._id,
      targetModel: 'User',
      metadata: { email, role: 'superadmin' },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      createdBy: req.user._id
    });

    res.status(201).json({
      message: 'Superadmin created successfully',
      superadmin: { 
        id: superadmin._id, 
        firstName, 
        lastName, 
        email, 
        role: superadmin.role 
      },
    });
  } catch (err) {
    console.error('Error creating superadmin:', err);
    res.status(500).json({ message: err.message });
  }
};