// controllers/progressController.js
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import Certificate from '../models/Certificate.js';
import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';
import Notification from '../models/Notification.js';
import { createNotification } from './notificationController.js';
import { body, validationResult, param, query } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware
import AuditLog from '../models/AuditLog.js';

/**
 * 🎥 Stream a lesson
 * - Students must be enrolled & payment completed
 * - Course must be published
 * - Instructors/Admins can access their courses/any course
 */
export const streamLesson = [
  auth,
  param('lessonId').isMongoId().withMessage('Valid lesson ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { lessonId } = req.params;
    const { _id: userId, role: userRole } = req.user;

    try {
      const lesson = await Lesson.findById(lessonId, { isDeleted: false })
        .populate('section', 'course title order')
        .lean();
      if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

      const course = await Course.findById(lesson.section.course, { isDeleted: false, status: 'published' });
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (userRole === 'student') {
        const enrollment = await Enrollment.findOne({
          user: userId,
          course: course._id,
          isActive: true,
          paymentStatus: 'completed',
          isDeleted: false
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });
      }

      if (userRole === 'instructor' && course.instructor.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Access denied: not your course' });
      }

      // Update view count analytics
      await Lesson.findByIdAndUpdate(lessonId, { $inc: { 'analytics.viewCount': 1 }, updatedBy: userId });

      // Update progress lastAccessedAt if student
      if (userRole === 'student') {
        await Progress.findOneAndUpdate(
          { user: userId, enrollment: enrollment._id, lesson: lessonId },
          { lastAccessedAt: new Date() },
          { upsert: true, new: true }
        );
      }

      // Audit log for access
      await AuditLog.create({
        action: 'lesson_streamed',
        targetId: lessonId,
        targetModel: 'Lesson',
        metadata: { course: course._id, userRole },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: userId
      });

      res.json({ 
        lesson: {
          ...lesson,
          thumbnailUrl: lesson.video?.thumbnail ? `${process.env.BASE_URL}/uploads/thumbnails/${lesson.video.thumbnail}` : null,
          contentUrl: lesson.video?.url || null
        } 
      });
    } catch (err) {
      console.error('Error streaming lesson:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * ✅ Mark a lesson as completed
 */
export const markLessonCompleted = [
  auth,
  requireRole(['student']),
  param('lessonId').isMongoId().withMessage('Valid lesson ID required'),
  body('timeSpent').optional().isFloat({ min: 0 }).withMessage('Time spent must be positive'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { lessonId } = req.params;
    const { _id: userId } = req.user;
    const { timeSpent = 0 } = req.body;

    try {
      const lesson = await Lesson.findById(lessonId, { isDeleted: false })
        .populate('section', 'course title order')
        .lean();
      if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

      const enrollment = await Enrollment.findOne({
        user: userId,
        course: lesson.section.course,
        isActive: true,
        paymentStatus: 'completed',
        isDeleted: false
      });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });

      const progress = await Progress.findOneAndUpdate(
        { user: userId, enrollment: enrollment._id, lesson: lessonId },
        { 
          status: 'completed', 
          completedAt: new Date(),
          timeSpent,
          lastAccessedAt: new Date(),
          updatedBy: userId
        },
        { upsert: true, new: true }
      ).lean();

      // Increment lesson completion count
      await Lesson.findByIdAndUpdate(lessonId, { 
        $inc: { 'analytics.completionCount': 1 },
        updatedBy: userId 
      });

      // Update average time spent
      const totalCompletions = (await Lesson.findById(lessonId)).analytics.completionCount;
      const newAvg = totalCompletions > 1 ? ((lesson.analytics.averageTimeSpent * (totalCompletions - 1) + timeSpent) / totalCompletions) : timeSpent;
      await Lesson.findByIdAndUpdate(lessonId, { 'analytics.averageTimeSpent': newAvg });

      // Audit log
      await AuditLog.create({
        action: 'lesson_completed',
        targetId: progress._id,
        targetModel: 'Progress',
        metadata: { lesson: lessonId, timeSpent },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: userId
      });

      res.json({ message: 'Lesson marked as completed', progress });
    } catch (err) {
      console.error('Error marking lesson completed:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * 📊 Get user progress for a course
 */
export const getProgress = [
  auth,
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId } = req.params;
    const { _id: userId, role: userRole } = req.user;

    try {
      let enrollment;
      if (userRole === 'student') {
        enrollment = await Enrollment.findOne({ 
          user: userId, 
          course: courseId, 
          isActive: true, 
          isDeleted: false 
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      const progressQuery = userRole === 'student' ? 
        { user: userId, enrollment: enrollment._id, isDeleted: false } : 
        { course: courseId, isDeleted: false }; // Admins see all

      const progress = await Progress.find(progressQuery)
        .populate('lesson', 'title contentType duration')
        .populate('quiz', 'title totalMarks passingScore')
        .sort({ completedAt: -1, lastAccessedAt: -1 });

      // Calculate overall stats
      const totalItems = progress.length;
      const completedItems = progress.filter(p => p.status === 'completed').length;
      const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);

      res.json({ 
        progress,
        stats: { overallProgress, totalItems, completedItems, totalTimeSpent }
      });
    } catch (err) {
      console.error('Error fetching progress:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * 🧑‍🎓 STUDENT DASHBOARD DATA
 * - Enrolled courses + completion %
 * - Quiz scores
 * - Certificates earned
 * - Latest notifications
 */
export const getStudentDashboard = [
  auth,
  requireRole(['student']),
  async (req, res) => {
    const { _id: userId } = req.user;

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
        });

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

        // Next item for continue button
        const nextUnfinished = progressEntries.find(p => p.status !== 'completed');
        const continueUrl = nextUnfinished ? 
          (nextUnfinished.lesson ? `/lessons/${nextUnfinished.lesson}` : `/quizzes/${nextUnfinished.quiz}`) : null;

        return {
          _id: course._id,
          title: course.title,
          thumbnailUrl: course.thumbnail ? `${req.protocol}://${req.get('host')}/uploads/thumbnails/${course.thumbnail.filename || course.thumbnail}` : null,
          completionPercentage,
          continueUrl,
          timeSpent: enrollment.timeSpent
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

      // 3️⃣ Certificates earned
      const certificates = await Certificate.find({ 
        user: userId, 
        status: 'issued', 
        isDeleted: false,
        isExpired: false
      })
        .populate('course', 'title thumbnail')
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
        .sort({ createdAt: -1, priority: -1 })
        .limit(10)
        .lean();

      // Audit log for dashboard access (optional, low priority)
      await AuditLog.create({
        action: 'dashboard_viewed',
        targetId: userId,
        targetModel: 'User',
        metadata: { section: 'student' },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: userId
      });

      res.json({
        enrolledCourses,
        quizScores,
        certificates,
        notifications,
        timestamp: new Date().toISOString() // For freshness
      });
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
      res.status(500).json({ message: err.message });
    }
  }
];
