import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Certificate from '../models/Certificate.js';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from './notificationController.js';

export const issueCertificate = async (req, res) => {
  const { courseId } = req.params;
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
      paymentStatus: 'completed',
    });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });

    const course = await Course.findById(courseId).populate({
      path: 'sections',
      populate: [
        { path: 'lessons' },
        { path: 'quizzes' },
      ],
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const progress = await Progress.find({ user: req.user.id, course: courseId });
    const lessonIds = course.sections.flatMap(section => section.lessons.map(lesson => lesson._id.toString()));
    const quizIds = course.sections.flatMap(section => section.quizzes.map(quiz => quiz._id.toString()));
    const completedLessons = progress.filter(p => p.lesson && p.completed).map(p => p.lesson.toString());
    const completedQuizzes = progress.filter(p => p.quiz && p.completed).map(p => p.quiz.toString());

    if (!lessonIds.every(id => completedLessons.includes(id)) || !quizIds.every(id => completedQuizzes.includes(id))) {
      return res.status(400).json({ message: 'Course not fully completed' });
    }

    const existingCertificate = await Certificate.findOne({ user: req.user.id, course: courseId });
    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already issued' });
    }

    const certificate = new Certificate({
      user: req.user.id,
      course: courseId,
      certificateId: uuidv4(),
    });
    await certificate.save();

    await createNotification(
      req.user.id,
      'certificate_issued',
      `You earned a certificate for ${course.title}!`,
      certificate._id,
      'Certificate'
    );

    res.json({ message: 'Certificate issued', certificate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .populate('course', 'title')
      .select('certificateId issuedAt');
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};