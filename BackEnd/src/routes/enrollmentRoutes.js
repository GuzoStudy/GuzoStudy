import express from 'express';
import { enrollCourse } from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, authorize('student'), enrollCourse);

export default router;