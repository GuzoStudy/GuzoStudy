// controllers/adminController.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import Progress from '../models/Progress.js';
import Review from '../models/Review.js';
import Discussion from '../models/Discussion.js';
import { protect, authorize } from '../middlewares/auth.js';

// Validation arrays for allowed actions and types
const userActions = ['ban', 'unban', 'promote'];
const courseActions = ['approve', 'reject', 'delete'];
const paymentActions = ['refund', 'verify'];
const contentTypes = ['review', 'discussion'];
const contentActions = ['delete', 'warn'];

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// manageUsers: Ban, unban, or promote users
export const manageUsers = async (req, res) => {
  const { userId, action } = req.body;

  // Input validation
  if (!userId || !isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid or missing userId' });
  }
  if (!action || !userActions.includes(action)) {
    return res.status(400).json({ message: `Action must be one of: ${userActions.join(', ')}` });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check for redundant actions
    if (action === 'ban' && user.isBanned) {
      return res.status(400).json({ message: 'User is already banned' });
    }
    if (action === 'unban' && !user.isBanned) {
      return res.status(400).json({ message: 'User is not banned' });
    }
    if (action === 'promote' && user.role === 'instructor') {
      return res.status(400).json({ message: 'User is already an instructor' });
    }

    // Update user
    if (action === 'ban') user.isBanned = true;
    else if (action === 'unban') user.isBanned = false;
    else if (action === 'promote') user.role = 'instructor';

    await user.save();

    // TODO: Log to AuditLog collection
    // await AuditLog.create({ adminId: req.user._id, action: `User ${action}ed`, targetId: userId });
    // TODO: Send notification to user (e.g., via email)

    res.json({ message: `User ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// manageCourses: Approve, reject, or delete courses
export const manageCourses = async (req, res) => {
  const { courseId, action } = req.body;

  // Input validation
  if (!courseId || !isValidObjectId(courseId)) {
    return res.status(400).json({ message: 'Invalid or missing courseId' });
  }
  if (!action || !courseActions.includes(action)) {
    return res.status(400).json({ message: `Action must be one of: ${courseActions.join(', ')}` });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findById(courseId).session(session);
    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Course not found' });
    }

    if (action === 'approve' && course.status === 'published') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Course is already published' });
    }
    if (action === 'reject' && course.status === 'rejected') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Course is already rejected' });
    }

    if (action === 'approve') {
      course.status = 'published';
    } else if (action === 'reject') {
      course.status = 'rejected';
    } else if (action === 'delete') {
      await course.deleteOne({ session });
      // Remove related enrollments
      await Enrollment.deleteMany({ courseId }, { session });
      // TODO: Remove related reviews, progress, etc.
      await session.commitTransaction();
      session.endSession();
      // TODO: Log to AuditLog
      // TODO: Notify course creator
      return res.json({ message: 'Course deleted' });
    }

    await course.save({ session });
    await session.commitTransaction();
    session.endSession();

    // TODO: Log to AuditLog
    // TODO: Notify course creator
    res.json({ message: `Course ${action}ed successfully` });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Internal server error' });
  }
};

// getPlatformAnalytics: Retrieve platform analytics
export const getPlatformAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const matchQuery = { status: 'completed' };
    if (startDate && endDate) {
      if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      matchQuery.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments({ status: 'published' });
    const enrollmentCount = await Enrollment.countDocuments({ paymentStatus: 'completed' });
    const revenue = await Payment.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      userCount,
      courseCount,
      enrollmentCount,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// managePayments: Refund or verify payments
export const managePayments = async (req, res) => {
  const { paymentId, action } = req.body;

  // Input validation
  if (!paymentId || !isValidObjectId(paymentId)) {
    return res.status(400).json({ message: 'Invalid or missing paymentId' });
  }
  if (!action || !paymentActions.includes(action)) {
    return res.status(400).json({ message: `Action must be one of: ${paymentActions.join(', ')}` });
  }

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Check for redundant actions
    if (action === 'refund' && payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment is already refunded' });
    }
    if (action === 'verify' && payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment is already verified' });
    }

    if (action === 'refund') {
      // TODO: Integrate with payment gateway (e.g., Stripe)
      payment.status = 'refunded';
    } else if (action === 'verify') {
      payment.status = 'completed';
    }

    await payment.save();
    // TODO: Log to AuditLog
    // TODO: Notify user
    res.json({ message: `Payment ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// manageReportedContent: Delete or warn reported content
export const manageReportedContent = async (req, res) => {
  const { contentId, contentType, action } = req.body;

  // Input validation
  if (!contentId || !isValidObjectId(contentId)) {
    return res.status(400).json({ message: 'Invalid or missing contentId' });
  }
  if (!contentType || !contentTypes.includes(contentType)) {
    return res.status(400).json({ message: `Content type must be one of: ${contentTypes.join(', ')}` });
  }
  if (!action || !contentActions.includes(action)) {
    return res.status(400).json({ message: `Action must be one of: ${contentActions.join(', ')}` });
  }

  try {
    let content;
    if (contentType === 'review') {
      content = await Review.findById(contentId);
    } else if (contentType === 'discussion') {
      content = await Discussion.findById(contentId);
    }
    if (!content) return res.status(404).json({ message: 'Content not found' });

    if (action === 'delete') {
      await content.deleteOne();
      // TODO: Log to AuditLog
      res.json({ message: 'Content deleted' });
    } else if (action === 'warn') {
      // TODO: Implement warning logic (e.g., notify user, flag account)
      // Example: await User.findByIdAndUpdate(content.userId, { $inc: { warnings: 1 } });
      res.json({ message: 'User warned' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};