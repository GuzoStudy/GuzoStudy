import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';

export const streamLesson = async (req, res) => {
  const { lessonId } = req.params;
  console.log('streamLesson - lessonId:', lessonId, 'user:', req.user);
  try {
    const lesson = await Lesson.findById(lessonId).populate('section');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    console.log('Lesson:', lesson);

    const course = await Course.findById(lesson.section.course);
    console.log('Course:', course);
    if (!course || course.status !== 'published') {
      return res.status(400).json({ message: 'Course not available' });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: lesson.section.course,
      paymentStatus: 'completed',
    });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });

    res.json({ lesson });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const markLessonCompleted = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const lesson = await Lesson.findById(lessonId).populate('section');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: lesson.section.course,
      paymentStatus: 'completed',
    });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });

    let progress = await Progress.findOne({
      user: req.user.id,
      course: lesson.section.course,
      lesson: lessonId,
    });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        course: lesson.section.course,
        lesson: lessonId,
        completed: true,
        completedAt: new Date(),
      });
    } else {
      progress.completed = true;
      progress.completedAt = new Date();
    }
    await progress.save();

    res.json({ message: 'Lesson marked as completed', progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProgress = async (req, res) => {
  const { courseId } = req.params;
  try {
    const progress = await Progress.find({ user: req.user.id, course: courseId })
      .populate('lesson', 'title')
      .populate('quiz', 'title');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};