// controllers/quizController.js
import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';
import { body, validationResult } from 'express-validator';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import mongoose from 'mongoose';
import { auth, requireRole } from '../middlewares/auth.js';
import AuditLog from '../models/AuditLog.js';
import Course from '../models/Course.js';
import Section from '../models/Section.js';

// ✅ Create quiz (Instructor/Admin only)
export const createQuiz = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('course').notEmpty().isMongoId().withMessage('Valid course ID required'),
  body('section').optional().isMongoId().withMessage('Valid section ID required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question required'),
  body('questions.*.question').trim().notEmpty().withMessage('Question text required'),
  body('questions.*.type')
    .optional()
    .isIn(['multiple_choice', 'true_false', 'short_answer', 'matching'])
    .withMessage('Invalid question type'),
  body('questions.*.marks').optional().isFloat({ min: 0 }).withMessage('Marks must be non-negative').default(1),
  body('questions.*.options').custom((options, { req, path }) => {
    const match = path.match(/questions\[(\d+)\]/);
    const index = match ? parseInt(match[1]) : null;
    const question = index !== null ? req.body.questions[index] : null;
    if (!question) return true;
    if (['multiple_choice', 'true_false'].includes(question.type)) {
      if (!Array.isArray(options) || options.length < 2) {
        throw new Error('At least two options required for multiple_choice or true_false');
      }
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, course, section, questions } = req.body;

    try {
      const courseDoc = await Course.findOne({ _id: course, isDeleted: false });
      if (!courseDoc) return res.status(404).json({ message: 'Course not found' });

      if (req.user.role === 'instructor' && courseDoc.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized for this course' });
      }

      if (section) {
        const sectionDoc = await Section.findOne({ _id: section, course, isDeleted: false });
        if (!sectionDoc) return res.status(404).json({ message: 'Section not found or does not belong to this course' });
      }

      const sanitizedQuestions = questions.map((q) => ({
        question: q.question.trim(),
        type: q.type || 'multiple_choice',
        options: Array.isArray(q.options) ? q.options : [],
        correctOption: ['multiple_choice', 'true_false'].includes(q.type) ? parseInt(q.correctOption) : undefined,
        correctAnswer: q.correctAnswer?.trim(),
        marks: parseFloat(q.marks) || 1,
        explanation: q.explanation?.trim() || '',
        section: section || undefined,
        analytics: { attemptCount: 0, averageScore: 0, passRate: 0 },
        passingScore: q.passingScore || 70,
        shuffleOptions: q.shuffleOptions ?? true,
        allowRetakes: q.allowRetakes ?? true,
        maxAttempts: q.maxAttempts || 0,
      }));

      const totalMarks = sanitizedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

      const quiz = new Quiz({
        title: title.trim(),
        course,
        section: section || undefined,
        questions: sanitizedQuestions,
        totalMarks,
        createdBy: req.user._id,
        updatedBy: req.user._id,
        isPublished: req.body.isPublished || false,
        duration: req.body.duration || Math.ceil(sanitizedQuestions.length * 0.5),
      });

      await quiz.save();

      await AuditLog.create({
        action: 'quiz_created',
        targetId: quiz._id,
        targetModel: 'Quiz',
        metadata: { course, totalMarks, questionCount: sanitizedQuestions.length },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id,
      });

      res.status(201).json({
        message: 'Quiz created successfully',
        quiz: { id: quiz._id, title: quiz.title, totalMarks, questionCount: sanitizedQuestions.length },
      });
    } catch (err) {
      console.error('🔴 Create Quiz Error:', err);
      res.status(500).json({ message: err.message });
    }
  },
];

// ✅ Get all quizzes for a course
export const getQuizzes = [
  auth,
  async (req, res) => {
    const { courseId } = req.params;

    try {
      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (req.user.role === 'student') {
        const enrollment = await Enrollment.findOne({ 
          user: req.user._id, 
          course: courseId, 
          isActive: true, 
          isDeleted: false 
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      const quizzes = await Quiz.find({ 
        course: courseId, 
        isPublished: true, 
        isDeleted: false 
      })
        .populate('section', 'title')
        .select('-questions.correctOption -questions.answerRegex');

      res.json(quizzes);
    } catch (err) {
      console.error('Get Quizzes Error:', err.message);
      res.status(500).json({ message: err.message });
    }
  }
];

// ✅ Get single quiz
export const getQuiz = [
  auth,
  async (req, res) => {
    const { quizId } = req.params;

    try {
      const quiz = await Quiz.findById(quizId).populate('course section', 'title');
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

      if (req.user.role === 'student') {
        const enrollment = await Enrollment.findOne({ 
          user: req.user._id, 
          course: quiz.course._id, 
          isActive: true, 
          isDeleted: false 
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
      } else if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized for this quiz' });
      }

      if (req.user.role === 'student') {
        const studentQuiz = { ...quiz.toObject() };
        studentQuiz.questions = studentQuiz.questions.map(q => {
          const { correctOption, answerRegex, ...safeQ } = q;
          return safeQ;
        });
        return res.json(studentQuiz);
      }

      res.json(quiz);
    } catch (err) {
      console.error('Get Quiz Error:', err.message);
      res.status(500).json({ message: err.message });
    }
  }
];

// ✅ Submit quiz
export const submitQuiz = [
  auth,
  requireRole(['student']),
  body('answers').isArray({ min: 1 }).withMessage('Answers required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { quizId } = req.params;
    const { answers } = req.body;
    const userId = req.user._id;

    try {
      const quiz = await Quiz.findById(quizId).populate('course');
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

      const enrollment = await Enrollment.findOne({
        user: userId,
        course: quiz.course._id,
        isActive: true,
        isDeleted: false
      });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });

      const existingSubs = await QuizSubmission.countDocuments({ quiz: quizId, user: userId, isDeleted: false });
      if (quiz.maxAttempts > 0 && existingSubs >= quiz.maxAttempts) {
        return res.status(403).json({ message: 'Maximum attempts exceeded' });
      }

      let score = 0;
      const processedAnswers = [];

      answers.forEach((a, index) => {
        const question = quiz.questions[index];
        if (!question) return;

        let isCorrect = false;
        let pointsEarned = 0;

        if (question.type === 'multiple_choice') {
          if (parseInt(a.selectedOption) === question.correctOption) {
            isCorrect = true;
            pointsEarned = question.marks || 1;
          }
        } else if (question.type === 'true_false') {
          isCorrect = a.selectedOption === question.correctAnswer;
          pointsEarned = isCorrect ? (question.marks || 1) : 0;
        } else if (question.type === 'short_answer') {
          const regex = new RegExp(question.answerRegex || question.correctAnswer, 'i');
          isCorrect = regex.test(a.answer);
          pointsEarned = isCorrect ? (question.marks || 1) : 0;
        }

        score += pointsEarned;
        processedAnswers.push({ questionIndex: index, selectedOption: a.selectedOption, answer: a.answer, isCorrect, pointsEarned });

        question.analytics.attemptCount += 1;
        if (isCorrect) {
          question.analytics.passRate = ((question.analytics.passRate * (question.analytics.attemptCount - 1) + 100) / question.analytics.attemptCount);
        }
      });

      const submission = new QuizSubmission({
        quiz: quizId,
        user: userId,
        enrollment: enrollment._id,
        answers: processedAnswers,
        score,
        maxScore: quiz.totalMarks,
        percentage: quiz.totalMarks > 0 ? Math.round((score / quiz.totalMarks) * 100) : 0,
        attempts: existingSubs + 1,
        timeSpent: req.body.timeSpent || 0,
        startTime: new Date(Date.now() - (req.body.timeSpent || 0) * 1000),
        createdBy: userId
      });

      await submission.save();
      await Quiz.findByIdAndUpdate(quizId, { $inc: { 'analytics.attemptCount': 1 } });

      if (submission.percentage >= quiz.passingScore) {
        await Progress.findOneAndUpdate(
          { enrollment: enrollment._id, quiz: quizId },
          { status: 'completed', completedAt: new Date(), score: submission.percentage, updatedBy: userId },
          { upsert: true, new: true }
        );
      }

      await AuditLog.create({
        action: 'quiz_submitted',
        targetId: submission._id,
        targetModel: 'QuizSubmission',
        metadata: { quiz: quizId, score: submission.score, percentage: submission.percentage },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: userId
      });

      res.json({ message: 'Quiz submitted successfully', score: submission.score, totalMarks: quiz.totalMarks, percentage: submission.percentage });
    } catch (err) {
      console.error('Submit Quiz Error:', err.message);
      res.status(500).json({ message: err.message });
    }
  }
];

// ✅ Get user's quiz results
export const getUserResults = [
  auth,
  async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
      const skip = (page - 1) * limit;
      const results = await QuizSubmission.find({ user: req.user._id, isDeleted: false, status: 'graded' })
        .populate('quiz', 'title course')
        .populate('enrollment', 'course progress')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await QuizSubmission.countDocuments({ user: req.user._id, isDeleted: false, status: 'graded' });

      res.json({
        results,
        pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total }
      });
    } catch (err) {
      console.error('Get User Results Error:', err.message);
      res.status(500).json({ message: err.message });
    }
  }
];
export const updateQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { status, title } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Only instructor who created it or admin/superadmin can update
    if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }

    // ✅ Handle status properly (your schema uses isPublished)
    if (status) {
      quiz.isPublished = status === 'published';
    }

    if (title) {
      quiz.title = title;
    }

    quiz.updatedBy = req.user._id;
    quiz.updatedAt = new Date();
    await quiz.save();

    // ✅ Log the update
    await AuditLog.create({
      action: 'quiz_updated',
      targetId: quiz._id,
      targetModel: 'Quiz',
      metadata: { status, title },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      createdBy: req.user._id
    });

    res.json({ message: 'Quiz updated successfully', quiz });
  } catch (err) {
    console.error('Update Quiz Error:', err);
    res.status(500).json({ message: err.message });
  }
};
