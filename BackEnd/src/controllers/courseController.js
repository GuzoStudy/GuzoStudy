import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import { createNotification } from './notificationController.js';

export const createCourse = async (req, res) => {
  const { title, description, category, tags, price, discount, prerequisites, learningPaths } = req.body;
  try {
    const course = new Course({
      title,
      description,
      instructor: req.user.id,
      category,
      tags,
      price,
      discount,
      prerequisites,
      learningPaths,
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(course, req.body);
    await course.save();

    const enrollments = await Enrollment.find({ course: courseId, paymentStatus: 'completed' });
    for (const enrollment of enrollments) {
      await createNotification(
        enrollment.user,
        'course_update',
        `Course ${course.title} has been updated.`,
        courseId,
        'Course'
      );
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSection = async (req, res) => {
  const { courseId } = req.params;
  const { title, order } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const section = new Section({ course: courseId, title, order });
    await section.save();

    course.sections.push(section._id);
    await course.save();

    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createLesson = async (req, res) => {
  const { sectionId } = req.params;
  const { title, contentType, textContent, videoUrl, duration, order } = req.body;
  try {
    const section = await Section.findById(sectionId).populate('course');
    if (!section) return res.status(404).json({ message: 'Section not found' });
    if (section.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const lesson = new Lesson({
      section: sectionId,
      title,
      contentType,
      textContent,
      videoUrl,
      duration,
      order,
    });
    await lesson.save();

    section.lessons.push(lesson._id);
    await section.save();

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};