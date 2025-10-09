// controllers/analyticsController.js
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import Progress from '../models/Progress.js';
import QuizSubmission from '../models/QuizSubmission.js';
import User from '../models/User.js';
import { param, query } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware
import AuditLog from '../models/AuditLog.js';
import { validationResult } from 'express-validator';

/**
 * 📊 Get analytics for a single course (instructor/admin only)
 */
export const getCourseAnalytics = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    try {
      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) return res.status(404).json({ message: 'Course not found' });

      const userId = req.user._id;
      const userRole = req.user.role;
      const isInstructor = course.instructor?.toString() === userId.toString();
      const isAdmin = ['admin', 'superadmin'].includes(userRole);

      if (!isInstructor && !isAdmin) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Date filter
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
      }

      // ✅ Aggregate payments directly by course
      const paymentsAgg = await Payment.aggregate([
        {
          $match: {
            course: mongoose.Types.ObjectId(courseId),
            status: 'completed',
            isDeleted: false,
            ...dateFilter
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            instructorShare: { $sum: '$instructorShare' },
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      const { totalRevenue = 0, instructorShare = 0, transactionCount = 0 } = paymentsAgg[0] || {};

      // ✅ Completed students based on enrollments with completed payment
      const completedStudents = await Enrollment.countDocuments({
        course: courseId,
        paymentStatus: 'completed',
        isDeleted: false,
        ...dateFilter
      });

      // ✅ Average quiz score
      const quizAgg = await QuizSubmission.aggregate([
        { 
          $match: { 
            course: mongoose.Types.ObjectId(courseId), 
            isDeleted: false,
            status: 'graded',
            ...dateFilter 
          } 
        },
        { 
          $group: { 
            _id: null, 
            avgScore: { $avg: '$percentage' },
            submissionCount: { $sum: 1 } 
          } 
        }
      ]);
      const averageQuizScore = quizAgg[0]?.avgScore || 0;
      const quizSubmissions = quizAgg[0]?.submissionCount || 0;

      // ✅ Completion rate
      const [totalEnrollments, completedEnrollments] = await Promise.all([
        Enrollment.countDocuments({ course: courseId, isDeleted: false }),
        Enrollment.countDocuments({ 
          course: courseId, 
          progress: 100, 
          isDeleted: false,
          ...dateFilter 
        })
      ]);
      const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

      // Audit log
      await AuditLog.create({
        action: 'course_analytics_viewed',
        targetId: courseId,
        targetModel: 'Course',
        metadata: { dateFilter: { startDate, endDate } },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.json({
        courseId,
        courseTitle: course.title,
        enrollmentCount: totalEnrollments,
        completedStudents,
        completionRate,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        instructorShare: parseFloat(instructorShare.toFixed(2)),
        transactionCount,
        averageQuizScore: parseFloat(averageQuizScore.toFixed(2)),
        quizSubmissions,
        dateRange: startDate || endDate ? { startDate, endDate } : null
      });

    } catch (err) {
      console.error('Error in getCourseAnalytics:', err);
      res.status(500).json({ message: 'Failed to fetch course analytics' });
    }
  }
];


/**
 * 📊 Get instructor-wide analytics (expanded with growth charts)
 */
export const getInstructorAnalytics = [
  auth,
  requireRole(['instructor']),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  async (req, res) => {
    const { startDate, endDate } = req.query;
    const instructorId = req.user._id;

    try {
      // 🗓️ Date filters
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
      }
      const hasDateFilter = Object.keys(dateFilter).length > 0;

      // 1️⃣ Courses taught by instructor
      const courseFilter = { instructor: instructorId, isDeleted: false };
      if (hasDateFilter) courseFilter.createdAt = dateFilter;
      const courses = await Course.find(courseFilter).select("_id title");
      const courseIds = courses.map(c => c._id);
      const courseCount = courseIds.length;

      // 2️⃣ Enrollment count = completed enrollments in these courses
      const enrollmentFilter = { 
        course: { $in: courseIds }, 
        paymentStatus: "completed",
        isDeleted: false 
      };
      if (hasDateFilter) enrollmentFilter.createdAt = dateFilter;
      const enrollments = await Enrollment.find(enrollmentFilter).select("_id user");
      const enrollmentCount = enrollments.length;

      // 3️⃣ Total revenue & instructor share from payments
      const paymentMatch = { 
        course: { $in: courseIds }, 
        status: "completed",
        isDeleted: false 
      };
      if (hasDateFilter) paymentMatch.createdAt = dateFilter;

      const revenueStats = await Payment.aggregate([
        { $match: paymentMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            instructorShare: { $sum: "$instructorShare" },
            transactionCount: { $sum: 1 }
          },
        },
      ]);
      const totalRevenue = revenueStats[0]?.totalRevenue || 0;
      const instructorShare = revenueStats[0]?.instructorShare || 0;
      const transactionCount = revenueStats[0]?.transactionCount || 0;

      // 4️⃣ Completed students = unique users with 100% progress
      const completedEnrollments = await Enrollment.find({ 
        course: { $in: courseIds }, 
        progress: 100, 
        isDeleted: false 
      }).select('user');
      const completedStudents = new Set(completedEnrollments.map(e => e.user.toString())).size;

      // 5️⃣ Daily earnings (for growth chart)
      const dailyBreakdown = await Payment.aggregate([
        { $match: paymentMatch },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalRevenue: { $sum: "$amount" },
            instructorShare: { $sum: "$instructorShare" },
            transactions: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]);

      // 6️⃣ Monthly earnings (for chart)
      const monthlyBreakdown = await Payment.aggregate([
        { $match: paymentMatch },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            totalRevenue: { $sum: "$amount" },
            instructorShare: { $sum: "$instructorShare" },
            transactions: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      const monthlyEarnings = monthlyBreakdown.map(item => {
        const date = new Date(item._id.year, item._id.month - 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        return {
          year: item._id.year,
          month: monthName,
          totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
          instructorShare: parseFloat(item.instructorShare.toFixed(2)),
          transactions: item.transactions
        };
      });

      // 7️⃣ Additional metrics: averages
      const avgRevenuePerStudent = completedStudents > 0 ? parseFloat((totalRevenue / completedStudents).toFixed(2)) : 0;
      const avgEnrollmentsPerCourse = courseCount > 0 ? parseFloat((enrollmentCount / courseCount).toFixed(2)) : 0;

      // Revenue per course
      const revenuePerCourseAgg = await Payment.aggregate([
        { $match: paymentMatch },
        {
          $group: {
            _id: "$course",
            totalRevenue: { $sum: "$amount" },
            instructorShare: { $sum: "$instructorShare" },
            transactions: { $sum: 1 },
          },
        },
      ]);

      // Populate course titles
      const revenuePerCourse = await Promise.all(
        revenuePerCourseAgg.map(async item => {
          const course = await Course.findById(item._id, { isDeleted: false }).select("title");
          return {
            courseId: item._id,
            courseTitle: course?.title || "Unknown",
            totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
            instructorShare: parseFloat(item.instructorShare.toFixed(2)),
            transactions: item.transactions,
          };
        })
      );

      // Audit log
      await AuditLog.create({
        action: 'instructor_analytics_viewed',
        targetId: req.user._id,
        targetModel: 'User',
        metadata: { dateFilter: { startDate, endDate }, metrics: { courseCount, enrollmentCount } },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.json({
        courseCount,
        enrollmentCount,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        instructorShare: parseFloat(instructorShare.toFixed(2)),
        transactionCount,
        completedStudents,
        avgRevenuePerStudent,
        avgEnrollmentsPerCourse,
        dateRange: startDate || endDate ? { startDate, endDate } : null,
        dailyEarnings: dailyBreakdown.map(item => ({
          date: item._id,
          totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
          instructorShare: parseFloat(item.instructorShare.toFixed(2)),
          transactions: item.transactions,
        })),
        monthlyEarnings,
        revenuePerCourse, // ✅ Added here
      });

    } catch (error) {
      console.error('Error in getInstructorAnalytics:', error);
      res.status(500).json({ message: 'Failed to fetch instructor analytics' });
    }
  }
];


/**
 * 📊 Get top instructor courses (with earnings breakdown for chart)
 */
export const getTopInstructorCourses = [
  auth,
  requireRole(['instructor']),
  query('year').optional().isInt({ min: 2000, max: 2030 }).default(new Date().getFullYear()),
  query('month').optional().isInt({ min: 1, max: 12 }),
  async (req, res) => {
    const { year, month } = req.query;
    const instructorId = req.user._id;

    try {
      const matchStage = {
        instructor: instructorId,
        status: "completed",
        isDeleted: false
      };

      // Optional date filtering
      if (year || month) {
        const start = new Date(parseInt(year) || new Date().getFullYear(), (parseInt(month) || 0) - 1, 1);
        const end = new Date(
          parseInt(year) || new Date().getFullYear(),
          parseInt(month) || 12,
          parseInt(month) ? new Date(parseInt(year) || new Date().getFullYear(), parseInt(month), 0).getDate() : 31,
          23, 59, 59
        );
        matchStage.createdAt = { $gte: start, $lte: end };
      }

      // Aggregate top courses
      const topCourses = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$course",
            totalEarnings: { $sum: "$instructorShare" },
            totalEnrollments: { $sum: 1 },
            transactionCount: { $sum: 1 }
          }
        },
        { $sort: { totalEarnings: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course",
            pipeline: [{ $match: { isDeleted: false } }]
          }
        },
        { $unwind: "$course" },
        {
          $project: {
            _id: 0,
            courseId: "$course._id",
            title: "$course.title",
            totalEarnings: { $ifNull: ["$totalEarnings", 0] },
            totalEnrollments: { $ifNull: ["$totalEnrollments", 0] },
            transactionCount: { $ifNull: ["$transactionCount", 0] }
          }
        }
      ]);

      // Calculate total earnings for percentage
      const totalEarningsSum = topCourses.reduce((sum, c) => sum + c.totalEarnings, 0);
      const topCoursesWithPercent = topCourses.map(c => ({
        ...c,
        earningsPercent: totalEarningsSum ? parseFloat(((c.totalEarnings / totalEarningsSum) * 100).toFixed(2)) : 0
      }));

      // Audit log
      await AuditLog.create({
        action: 'top_courses_viewed',
        targetId: instructorId,
        targetModel: 'User',
        metadata: { topCount: topCourses.length, filters: { year, month } },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: instructorId
      });

      res.json({ topCourses: topCoursesWithPercent });
    } catch (err) {
      console.error('Error in getTopInstructorCourses:', err.message);
      res.status(500).json({ message: 'Failed to fetch top earning courses' });
    }
  }
];

/**
 * 📊 Get instructor earnings (simple total)
 */
export const getInstructorEarnings = [
  auth,
  requireRole(['instructor']),
  async (req, res) => {
    try {
      // Aggregate only completed payments for this instructor
      const earnings = await Payment.aggregate([
        { 
          $match: { 
            instructor: req.user._id, 
            status: "completed",
            isDeleted: false 
          } 
        },
        { 
          $group: { 
            _id: null, 
            totalEarnings: { $sum: "$instructorShare" },
            totalRevenue: { $sum: "$amount" },
            completedPayments: { $sum: 1 }
          } 
        }
      ]);

      // Audit log
      await AuditLog.create({
        action: 'instructor_earnings_viewed',
        targetId: req.user._id,
        targetModel: 'User',
        metadata: { earnings: earnings[0]?.totalEarnings },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.json({
        totalEarnings: earnings[0]?.totalEarnings ? parseFloat(earnings[0].totalEarnings.toFixed(2)) : 0,
        totalRevenue: earnings[0]?.totalRevenue ? parseFloat(earnings[0].totalRevenue.toFixed(2)) : 0,
        completedPayments: earnings[0]?.completedPayments || 0,
        currency: 'ETB'
      });

    } catch (err) {
      console.error('Instructor Earnings Error:', err.message);
      res.status(500).json({ message: 'Failed to fetch earnings' });
    }
  }
];
