// controllers/enrollmentController.js
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Certificate from '../models/Certificate.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';
import Notification from '../models/Notification.js';
import { createNotification } from './notificationController.js';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult, param } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware
import AuditLog from '../models/AuditLog.js';

/**
 * 📝 Enroll a user in a course
 * - Checks duplicates
 * - Marks payment as completed (simulate)
 * - Sends notification
 * - Auto-checks certificate eligibility if course completed
 */
export const enrollCourse = [
  auth,
  requireRole(['student']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const courseId = req.params.courseId;

    try {
      // ✅ Corrected query
      const course = await Course.findOne({ _id: courseId, isDeleted: false, status: 'published' })
        .populate({
          path: 'sections',
          match: { isDeleted: false },
          populate: { 
            path: 'lessons quizzes', 
            match: { isDeleted: false, status: 'published' } 
          }
        });

      if (!course) return res.status(404).json({ message: 'Course not found' });

      const existing = await Enrollment.findOne({ 
        user: req.user._id, 
        course: courseId, 
        isActive: true, 
        isDeleted: false 
      });
      if (existing) return res.status(400).json({ message: 'Already enrolled' });

      const enrollment = new Enrollment({
        user: req.user._id,
        course: courseId,
        paymentStatus: 'completed', // Simulate payment completed
        enrollmentPrice: course.pricing.currentPrice || course.pricing.basePrice,
        currency: course.pricing.currency,
          isActive: true, // <-- add this

        createdBy: req.user._id
      });
      await enrollment.save();

      // Notification
      await createNotification(
        req.user._id,
        'enrollment',
        `Successfully enrolled in ${course.title}. Welcome!`,
        course._id,
        'Course',
        'student'
      );

      // Auto certificate check if course completed
      const lessonIds = course.sections.flatMap(s => s.lessons.map(l => l._id.toString()));
      const quizIds = course.sections.flatMap(s => s.quizzes.map(q => q._id.toString()));
      const allProgress = await Progress.find({ user: req.user._id, course: courseId, isDeleted: false });
      const completedLessons = allProgress.filter(p => p.lesson && p.status === 'completed').map(p => p.lesson.toString());
      const completedQuizzes = allProgress.filter(p => p.quiz && p.status === 'completed').map(p => p.quiz.toString());

      if (lessonIds.every(id => completedLessons.includes(id)) && quizIds.every(id => completedQuizzes.includes(id))) {
        const existingCert = await Certificate.findOne({ 
          user: req.user._id, 
          course: courseId, 
          isDeleted: false 
        });
        if (!existingCert) {
          const certificate = new Certificate({
            user: req.user._id,
            course: courseId,
            enrollment: enrollment._id,
            certificateId: uuidv4(),
            createdBy: req.user._id
          });
          await certificate.save();
          await createNotification(
            req.user._id,
            'certificate_issued',
            `Certificate earned for ${course.title}!`,
            certificate._id,
            'Certificate'
          );
        }
      }

      // Audit log
      await AuditLog.create({
        action: 'enrollment_created',
        targetId: enrollment._id,
        targetModel: 'Enrollment',
        metadata: { course: courseId },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (err) {
      console.error('Enrollment Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];


/**
 * 🧑‍🎓 Student dashboard
 * - Courses + completion %
 * - Upcoming lessons
 * - Certificates
 * - Quiz scores
 * - Notifications
 */
export const getStudentDashboard = [
  auth,
  requireRole(['student']),
  async (req, res) => {
    const userId = req.user._id;

    try {
      // 1️⃣ Enrolled courses with completion %
      const enrollments = await Enrollment.find({ 
        user: userId, 
        paymentStatus: 'completed', 
        isActive: true, 
        isDeleted: false 
      })
        .populate({
          path: 'course',
          match: { isDeleted: false, status: 'published' },
          populate: { 
            path: 'sections', 
            populate: { 
              path: 'lessons quizzes', 
              match: { isDeleted: false, status: 'published' } 
            } 
          }
        })
        .sort({ enrolledAt: -1 });

      const enrolledCourses = await Promise.all(enrollments.map(async (enrollment) => {
        const course = enrollment.course;
        if (!course) return null; // Filter invalid

        // Calculate completion using Progress
        const progressEntries = await Progress.find({ 
          enrollment: enrollment._id, 
          isDeleted: false 
        }).lean();
        const totalItems = progressEntries.length;
        const completedItems = progressEntries.filter(p => p.status === 'completed').length;
        const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        // Upcoming lesson: first incomplete
        let upcomingLesson = null;
        for (const section of course.sections) {
          for (const lesson of section.lessons) {
            const done = progressEntries.find(p => p.lesson && p.lesson.toString() === lesson._id.toString() && p.status === 'completed');
            if (!done) {
              upcomingLesson = {
                lessonId: lesson._id,
                title: lesson.title,
                courseId: course._id,
                courseTitle: course.title
              };
              break;
            }
          }
          if (upcomingLesson) break;
        }

        return {
          _id: course._id,
          title: course.title,
          thumbnailUrl: course.thumbnail ? `${req.protocol}://${req.get('host')}/uploads/thumbnails/${course.thumbnail.filename || course.thumbnail}` : null,
          completionPercentage,
          upcomingLesson
        };
      })).then(results => results.filter(Boolean));

      // 2️⃣ Quiz scores (recent)
      const quizScores = await QuizSubmission.find({ 
        user: userId, 
        isDeleted: false, 
        status: 'graded' 
      })
        .populate('quiz', 'title')
        .sort({ completedAt: -1 })
        .limit(5)
        .lean();

      // 3️⃣ Certificates
      const certificates = await Certificate.find({ 
        user: userId, 
        status: 'issued', 
        isDeleted: false 
      })
        .populate('course', 'title')
        .sort({ issuedAt: -1 })
        .limit(3)
        .lean();

      // 4️⃣ Latest notifications
      const notifications = await Notification.find({ 
        user: userId, 
        read: false, 
        isDeleted: false, 
        expiresAt: { $gt: new Date() } 
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      res.json({
        enrolledCourses,
        quizScores,
        certificates,
        notifications,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * 📋 Get all enrollments for a user
 */
export const getUserEnrollments = [
  auth,
  requireRole(['student']),
  async (req, res) => {
    try {
      // Fetch all active enrollments for the user
      const enrollments = await Enrollment.find({ 
        user: req.user._id, 
        isActive: true, 
        isDeleted: false 
      })
      .populate('course', 'title thumbnail pricing status')
      .sort({ enrolledAt: -1 });

      // Attach certificate for each enrollment
      const result = await Promise.all(enrollments.map(async (enr) => {
        const certificate = await Certificate.findOne({
          enrollment: enr._id,
          isDeleted: false
        }).select('certificateId issuedAt status');

        return { ...enr.toObject(), certificate: certificate || null };
      }));

      res.json(result);
    } catch (err) {
      console.error('Error fetching user enrollments:', err);
      res.status(500).json({ message: err.message });
    }
  }
];


/**
 * 📊 Get all enrollments for a course (admin/instructor)
 * - Includes student info
 */
export const getCourseEnrollments = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId } = req.params;

    try {
      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) return res.status(404).json({ message: 'Course not found' });

      // Check ownership for instructors
      if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized for this course' });
      }

      const enrollments = await Enrollment.find({ 
        course: courseId, 
        isActive: true, 
        isDeleted: false 
      })
      .populate('user', 'fullName email profilePicture')
      .sort({ enrolledAt: -1 });

      // Attach certificate for each enrollment
      const result = await Promise.all(enrollments.map(async (enr) => {
        const certificate = await Certificate.findOne({
          enrollment: enr._id,
          isDeleted: false
        }).select('certificateId issuedAt status');

        return { ...enr.toObject(), certificate: certificate || null };
      }));

      res.json(result);
    } catch (err) {
      console.error('Error fetching course enrollments:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * 📈 Instructor course stats
 * - Total enrollments
 * - Completed lessons
 * - Revenue simulation
 */
export const getInstructorCourseStats = [
  auth,
  requireRole(['instructor']),
  async (req, res) => {
    const instructorId = req.user._id;

    try {
      const courses = await Course.find({ 
        instructor: instructorId, 
        isDeleted: false, 
        status: 'published' 
      }).lean();

      const stats = await Promise.all(courses.map(async (course) => {
        const enrollments = await Enrollment.find({ 
          course: course._id, 
          paymentStatus: 'completed', 
          isDeleted: false 
        });
        const enrollmentIds = enrollments.map(e => e._id);

        const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
        const totalQuizzes = course.sections.reduce((acc, s) => acc + s.quizzes.length, 0);
        const totalItems = totalLessons + totalQuizzes;

        const completedProgress = await Progress.countDocuments({ 
          course: course._id, 
          status: 'completed', 
          isDeleted: false 
        });

        const revenue = enrollments.reduce((sum, en) => sum + en.enrollmentPrice, 0);

        return {
          courseId: course._id,
          title: course.title,
          totalEnrollments: enrollments.length,
          completedItems: completedProgress,
          totalItems,
          completionRate: totalItems > 0 ? Math.round((completedProgress / totalItems) * 100) : 0,
          revenue: parseFloat(revenue.toFixed(2)),
          currency: 'USD'
        };
      }));

      // Audit log (optional)
      await AuditLog.create({
        action: 'instructor_stats_viewed',
        targetId: instructorId,
        targetModel: 'User',
        metadata: { courses: courses.length },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: instructorId
      });

      res.json(stats);
    } catch (err) {
      console.error('Error fetching instructor course stats:', err);
      res.status(500).json({ message: err.message });
    }
  }
];
