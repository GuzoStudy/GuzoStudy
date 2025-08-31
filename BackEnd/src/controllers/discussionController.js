import Discussion from '../models/Discussion.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { createNotification } from './notificationController.js';

export const createDiscussion = async (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isInstructor = course.instructor.toString() === req.user.id;
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
      paymentStatus: 'completed',
    });
    if (!isInstructor && !enrollment) {
      return res.status(403).json({ message: 'Not authorized to create discussion' });
    }

    const discussion = new Discussion({
      course: courseId,
      title,
      createdBy: req.user.id,
      posts: [],
    });
    await discussion.save();

    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const postReply = async (req, res) => {
  const { discussionId } = req.params;
  const { content } = req.body;
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    const course = await Course.findById(discussion.course);
    const isInstructor = course.instructor.toString() === req.user.id;
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: discussion.course,
      paymentStatus: 'completed',
    });
    if (!isInstructor && !enrollment) {
      return res.status(403).json({ message: 'Not authorized to post in discussion' });
    }

    discussion.posts.push({ user: req.user.id, content });
    await discussion.save();

    if (discussion.createdBy.toString() !== req.user.id) {
      await createNotification(
        discussion.createdBy,
        'discussion_reply',
        `New reply in discussion: ${discussion.title}`,
        discussionId,
        'Discussion'
      );
    }

    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDiscussions = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const discussions = await Discussion.find({ course: courseId })
      .populate('createdBy', 'name')
      .populate('posts.user', 'name');
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};