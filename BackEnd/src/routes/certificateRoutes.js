import express from 'express';
import { issueCertificate, getCertificates } from '../controllers/certificateController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:courseId/issue', protect, authorize('student'), issueCertificate);
router.get('/', protect, authorize('student'), getCertificates);

export default router;