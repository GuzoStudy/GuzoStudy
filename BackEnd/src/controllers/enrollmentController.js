import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

export const enrollCourse = async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existingEnrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existingEnrollment) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = new Enrollment({
      user: req.user.id,
      course: courseId,
    });
    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};