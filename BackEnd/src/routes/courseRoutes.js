import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import Course from '../models/Course.js';

const router = express.Router();

// Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single course by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create course (instructor only)
router.post('/', protect, authorize('instructor'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const course = new Course({
      title,
      description,
      price,
      instructor: req.user.id,
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update course (instructor only)
router.put('/:id', protect, authorize('instructor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    Object.assign(course, req.body);
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete course (instructor only)
router.delete('/:id', protect, authorize('instructor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await course.remove();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
