import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import Progress from '../models/Progress.js';
import QuizSubmission from '../models/QuizSubmission.js';

export const getCourseAnalytics = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const enrollments = await Enrollment.find({ course: courseId, paymentStatus: 'completed' });
    const enrollmentCount = enrollments.length;

    const payments = await Payment.find({ enrollment: { $in: enrollments.map(e => e._id) }, status: 'completed' });
    const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);
    const instructorShare = payments.reduce((acc, payment) => acc + payment.instructorShare, 0);

    const progress = await Progress.find({ course: courseId, completed: true });
    const completedStudents = [...new Set(progress.map(p => p.user.toString()))].length;

    const quizSubmissions = await QuizSubmission.find({ course: courseId });
    const averageQuizScore = quizSubmissions.length
      ? quizSubmissions.reduce((acc, sub) => acc + sub.score, 0) / quizSubmissions.length
      : 0;

    res.json({
      courseId,
      enrollmentCount,
      totalRevenue,
      instructorShare,
      completedStudents,
      averageQuizScore,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInstructorAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    const courseIds = courses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds }, paymentStatus: 'completed' });
    const enrollmentCount = enrollments.length;

    const payments = await Payment.find({ enrollment: { $in: enrollments.map(e => e._id) }, status: 'completed' });
    const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);
    const instructorShare = payments.reduce((acc, payment) => acc + payment.instructorShare, 0);

    const progress = await Progress.find({ course: { $in: courseIds }, completed: true });
    const completedStudents = [...new Set(progress.map(p => p.user.toString()))].length;

    res.json({
      courseCount: courses.length,
      enrollmentCount,
      totalRevenue,
      instructorShare,
      completedStudents,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};