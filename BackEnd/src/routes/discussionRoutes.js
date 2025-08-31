import express from 'express';
import { createDiscussion, postReply, getDiscussions } from '../controllers/discussionController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:courseId', protect, authorize('student', 'instructor'), createDiscussion);
router.post('/:discussionId/reply', protect, authorize('student', 'instructor'), postReply);
router.get('/:courseId', protect, authorize('student', 'instructor'), getDiscussions);

export default router;