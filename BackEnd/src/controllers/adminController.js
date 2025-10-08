// controllers/adminController.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import Discussion from '../models/Discussion.js';
import Quiz from '../models/Quiz.js';
import RefundRequest from '../models/RefundRequest.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import SiteSetting from '../models/SiteSetting.js';
import { body, validationResult, param, query } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware

// Helper function to create notifications
async function createNotification(userId, type, message, referenceId, referenceModel, role = 'student') {
  try {
    await Notification.create({
      user: userId,
      type,
      message,
      referenceId,
      referenceModel,
      role
    });
  } catch (err) {
    console.error('Notification creation error:', err);
  }
}

// ----------------- Create Admin -----------------
export const createAdmin = [
  auth,
  requireRole(['superadmin']),
  body('firstName').trim().notEmpty().escape().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  body('lastName').trim().notEmpty().escape().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { firstName, lastName, email, password } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existingUser = await User.findOne({ email, isDeleted: false }).session(session);
      if (existingUser) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'User already exists' });
      }

      const newAdmin = new User({
        firstName,
        lastName,
        email,
        password,
        role: 'admin',
        isVerified: { verified: true },
        createdBy: req.user._id
      });

      await newAdmin.save({ session });

      // Log action in AuditLog
      await AuditLog.create([{
        adminId: req.user._id,
        action: 'create_admin',
        targetId: newAdmin._id,
        targetModel: 'User',
        metadata: { email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: 'Admin created successfully',
        admin: { 
          id: newAdmin._id, 
          firstName: newAdmin.firstName, 
          lastName: newAdmin.lastName, 
          email: newAdmin.email, 
          role: newAdmin.role 
        }
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- Manage Courses -----------------
export const manageCourses = [
  auth,
  requireRole(['admin', 'superadmin']),
  body('courseId').isMongoId().withMessage('Valid course ID required'),
  body('action').isIn(['approve', 'reject', 'delete']).withMessage('Invalid action'),
  body('reason').optional().trim().escape().isLength({ max: 500 }).withMessage('Reason max 500 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId, action, reason } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const course = await Course.findById(courseId, { isDeleted: false }).session(session);
      if (!course) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Course not found' });
      }

      if (action === 'approve') {
        course.status = 'published';
        course.moderation.approvedBy = req.user._id;
        course.moderation.approvedAt = new Date();
        course.moderation.reviewNotes = reason || '';
        await course.save({ session });

        // Notify instructor
        await createNotification(
          course.instructor,
          'course_update',
          `Your course "${course.title}" has been approved!`,
          course._id,
          'Course',
          'instructor'
        );
      }

      if (action === 'reject') {
        course.status = 'rejected';
        course.moderation.rejectedBy = req.user._id;
        course.moderation.rejectedAt = new Date();
        course.moderation.rejectionReason = reason || 'No reason provided';
        await course.save({ session });

        // Notify instructor
        await createNotification(
          course.instructor,
          'alert',
          `Your course "${course.title}" was rejected. Reason: ${reason || 'See notes'}.`,
          course._id,
          'Course',
          'instructor'
        );
      }

      if (action === 'delete') {
        // Soft delete course
        course.isDeleted = true;
        course.deletedAt = new Date();
        await course.save({ session });

        // Mark enrollments as inactive
        await Enrollment.updateMany(
          { course: courseId, isDeleted: false }, 
          { isActive: false, isDeleted: true, deletedAt: new Date() },
          { session }
        );

        // Soft delete sections and lessons
        await Section.updateMany(
          { course: courseId, isDeleted: false }, 
          { isDeleted: true, deletedAt: new Date() },
          { session }
        );
        
        const sections = await Section.find({ course: courseId, isDeleted: false }).session(session);
        const sectionIds = sections.map(s => s._id);
        await Lesson.updateMany(
          { section: { $in: sectionIds }, isDeleted: false }, 
          { isDeleted: true, deletedAt: new Date() },
          { session }
        );
      }

      // Log action in AuditLog
      await AuditLog.create([{
        adminId: req.user._id,
        action: `course_${action}`,
        targetId: courseId,
        targetModel: 'Course',
        metadata: { reason },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: `Course ${action}ed successfully` });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- Platform Analytics -----------------
export const getPlatformAnalytics = [
  auth,
  requireRole(['admin', 'superadmin']),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
      }

      // ✅ Exclude deleted/suspended users
      const [userAgg, courseCount, enrollmentCount, revenueAgg, enrollmentsGrowth] = await Promise.all([
        User.aggregate([
          { $match: { isDeleted: false, isSuspended: false, ...dateFilter } },
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ]),
        Course.countDocuments({ status: 'published', isDeleted: false, ...dateFilter }),
        Enrollment.countDocuments({ paymentStatus: 'completed', isActive: true, isDeleted: false, ...dateFilter }),
        Payment.aggregate([
          { $match: { status: 'completed', isDeleted: false, ...dateFilter } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Enrollment.aggregate([
          { $match: { paymentStatus: 'completed', isDeleted: false, ...dateFilter } },
          { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$enrolledAt' } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ])
      ]);

      const totalRevenue = revenueAgg[0]?.total || 0;
      const totalUsers = Object.fromEntries(userAgg.map(u => [u._id, u.count]));
      const totalCourses = { active: courseCount, pending: await Course.countDocuments({ status: 'pending', isDeleted: false }) };

      // Fetch site settings for analytics context (e.g., platform fee)
      const siteSettings = await SiteSetting.findOne({ isActive: true, isDeleted: false });
      const platformFee = siteSettings?.platformFee || 0;

      // Audit log
      await AuditLog.create({
        adminId: req.user._id,
        action: 'platform_analytics_viewed',
        targetModel: 'Platform',
        metadata: { dateFilter },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json({
        totalUsers,
        totalCourses,
        totalEnrollments: enrollmentCount,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        platformFee,
        enrollmentsGrowth // For chart data
      });
    } catch (err) {
      console.error('Platform Analytics Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- Manage Payments -----------------
export const managePayments = [
  auth,
  requireRole(['admin', 'superadmin']),
  body('paymentId').isMongoId().withMessage('Valid payment ID required'),
  body('action').isIn(['verify', 'refund']).withMessage('Invalid action'),
  body('reason').optional().trim().escape().isLength({ max: 500 }).withMessage('Reason max 500 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { paymentId, action, reason } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const payment = await Payment.findById(paymentId, { isDeleted: false }).session(session);
      if (!payment) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Payment not found' });
      }

      if (action === 'verify') {
        payment.status = 'completed';
        payment.updatedBy = req.user._id;
        await payment.save({ session });
      }

      if (action === 'refund') {
        payment.status = 'refunded';
        payment.refundedAt = new Date();
        payment.notes = reason || 'Admin refund';
        payment.updatedBy = req.user._id;
        await payment.save({ session });

        // Update related enrollment
        if (payment.enrollment) {
          await Enrollment.findByIdAndUpdate(
            payment.enrollment,
            { isActive: false, refundStatus: 'processed' },
            { session }
          );
        }
      }

      // Log action in AuditLog
      await AuditLog.create([{
        adminId: req.user._id,
        action: `payment_${action}`,
        targetId: paymentId,
        targetModel: 'Payment',
        metadata: { reason },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: `Payment ${action}ed successfully` });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- Manage Refunds -----------------
export const manageRefunds = [
  auth,
  requireRole(['admin', 'superadmin']),
  body('refundId').isMongoId().withMessage('Valid refund ID required'),
  body('action').isIn(['approve', 'reject']).withMessage('Invalid action'),
  body('reason').optional().trim().escape().isLength({ max: 500 }).withMessage('Reason max 500 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { refundId, action, reason } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const refund = await RefundRequest.findById(refundId, { isDeleted: false }).session(session).populate('enrollment payment');
      if (!refund) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Refund request not found' });
      }

      if (action === 'approve') {
        refund.status = 'approved';
        refund.approvedBy = req.user._id;
        refund.approvedAt = new Date();
        refund.notes = reason || '';
        await refund.save({ session });

        // Process refund: update payment and enrollment if available
        if (refund.enrollment) {
          await Enrollment.findByIdAndUpdate(
            refund.enrollment._id,
            { isActive: false, refundStatus: 'processed' },
            { session }
          );
        }
        if (refund.payment) {
          const payment = await Payment.findById(refund.payment._id, { session });
          if (payment) {
            payment.status = 'refunded';
            payment.refundedAt = new Date();
            payment.notes = reason || 'Refund approved';
            payment.updatedBy = req.user._id;
            await payment.save({ session });
          }
        }

        // Notify user
        await createNotification(
          refund.user,
          'refund_approved',
          `Your refund request has been approved.`,
          refund._id,
          'RefundRequest',
          refund.user.role || 'student'
        );
      }

      if (action === 'reject') {
        refund.status = 'rejected';
        refund.rejectedBy = req.user._id;
        refund.rejectedAt = new Date();
        refund.rejectionReason = reason || 'No reason provided';
        await refund.save({ session });

        // Notify user
        await createNotification(
          refund.user,
          'alert',
          `Your refund request was rejected. Reason: ${reason || 'See notes'}.`,
          refund._id,
          'RefundRequest',
          refund.user.role || 'student'
        );
      }

      // Log action in AuditLog
      await AuditLog.create([{
        adminId: req.user._id,
        action: `refund_${action}`,
        targetId: refundId,
        targetModel: 'RefundRequest',
        metadata: { reason },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: `Refund request ${action}ed successfully` });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- Manage Reported Content -----------------
export const manageReportedContent = [
  auth,
  requireRole(['admin', 'superadmin']),
  body('contentId').isMongoId().withMessage('Valid content ID required'),
  body('contentType').isIn(['review', 'discussion', 'lesson', 'quiz']).withMessage('Invalid content type'),
  body('action').isIn(['delete', 'warn', 'ban_user']).withMessage('Invalid action'),
  body('reason').optional().trim().escape().isLength({ max: 500 }).withMessage('Reason max 500 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { contentId, contentType, action, reason } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let Model;
      switch (contentType) {
        case 'review': Model = Review; break;
        case 'discussion': Model = Discussion; break;
        case 'lesson': Model = Lesson; break;
        case 'quiz': Model = Quiz; break;
        default: throw new Error('Invalid content type');
      }

      const content = await Model.findById(contentId, { isDeleted: false }).session(session);
      if (!content) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Content not found' });
      }

      if (action === 'delete') {
        // Soft delete
        content.isDeleted = true;
        content.deletedAt = new Date();
        content.updatedBy = req.user._id;
        await content.save({ session });
      } else if (action === 'warn') {
        content.moderation = { ...content.moderation, flagged: true, flaggedAt: new Date(), reviewNotes: reason };
        content.updatedBy = req.user._id;
        await content.save({ session });
      } else if (action === 'ban_user') {
        // For Discussion/Review, ban user from content
        if (contentType === 'discussion' || contentType === 'review') {
          content.bannedUsers = content.bannedUsers || [];
          content.bannedUsers.push({ user: content.user, reason, bannedAt: new Date() });
        }
        content.updatedBy = req.user._id;
        await content.save({ session });
      }

      // Log action in AuditLog
      await AuditLog.create([{
        adminId: req.user._id,
        action: `${contentType}_${action}`,
        targetId: contentId,
        targetModel: contentType.charAt(0).toUpperCase() + contentType.slice(1),
        metadata: { reason },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: `Content ${action}ed successfully` });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- View Audit Logs -----------------
export const viewAuditLogs = [
  auth,
  requireRole(['admin', 'superadmin']),
  query('page').optional().isInt({ min: 1 }).default(1),
  query('limit').optional().isInt({ min: 1, max: 100 }).default(50),
  query('action').optional().trim().escape(),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  async (req, res) => {
    const { page = 1, limit = 50, action, startDate, endDate } = req.query;

    try {
      const filter = { isDeleted: false };
      if (action) filter.action = { $regex: action, $options: 'i' };
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await AuditLog.countDocuments(filter);

      const logs = await AuditLog.find(filter)
        .populate('adminId', 'fullName email')
        .populate('createdBy', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Log action in AuditLog
      await AuditLog.create({
        adminId: req.user._id,
        action: 'viewed_audit_logs',
        targetModel: 'AuditLog',
        metadata: { filters: { action, startDate, endDate } },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json({ 
        logs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      });
    } catch (err) {
      console.error('View Audit Logs Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- Manage Users -----------------
export const manageUsers = [
  auth,
  requireRole(['admin', 'superadmin']),
  body('userId').isMongoId().withMessage('Valid user ID required'),
  body('action').isIn(['suspend', 'unsuspend', 'promote', 'demote']).withMessage('Invalid action'),
  body('newRole').if(body('action').isIn(['promote', 'demote'])).isIn(['student', 'instructor', 'admin']).withMessage('Invalid role'),
  body('reason').optional().trim().escape().isLength({ max: 500 }).withMessage('Reason max 500 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { userId, action, newRole, reason } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId, { isDeleted: false }).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'User not found' });
      }

      // ✅ Use isSuspended (matches your enhanced model)
      if (action === 'suspend') {
        user.isSuspended = true;
        user.updatedBy = req.user._id;
      }
      if (action === 'unsuspend') {
        user.isSuspended = false;
        user.updatedBy = req.user._id;
      }
      if (action === 'promote' || action === 'demote') {
        const validRoles = ['student', 'instructor', 'admin'];
        if (!validRoles.includes(newRole)) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: 'Invalid role' });
        }
        user.role = newRole;
        user.updatedBy = req.user._id;
      }

      await user.save({ session });

      // Log action in AuditLog
      await AuditLog.create([{
        adminId: req.user._id,
        action: `user_${action}`,
        targetId: userId,
        targetModel: 'User',
        metadata: { newRole, reason },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: `User ${action}ed successfully` });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: err.message });
    }
  }
];

// ----------------- Update Site Settings -----------------
export const updateSiteSettings = [
  auth,
  requireRole(['superadmin']),
  body('platformFee').optional().isFloat({ min: 0, max: 100 }).withMessage('Platform fee must be between 0 and 100'),
  // Add other validations for specific fields as needed
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const updates = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let siteSetting = await SiteSetting.findOne({ isActive: true, isDeleted: false }).session(session);
      if (!siteSetting) {
        siteSetting = new SiteSetting({
          ...updates,
          isActive: true
        });
        await siteSetting.save({ session });
      } else {
        Object.assign(siteSetting, updates);
        await siteSetting.save({ session });
      }

      // Log action in AuditLog
      await AuditLog.create([{
        adminId: req.user._id,
        action: 'update_site_settings',
        targetModel: 'SiteSetting',
        metadata: updates,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: 'Site settings updated successfully' });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: err.message });
    }
  }
];
