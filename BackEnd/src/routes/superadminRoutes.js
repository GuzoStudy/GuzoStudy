// routes/superadminRoutes.js
import express from 'express';
import { createSuperadmin } from '../controllers/userController.js'; // ✅ Use userController
import { protect, authorize } from '../middlewares/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create superadmin route
router.post(
  '/create-superadmin',
  protect,
  authorize('superadmin'), 
  [ body('secretKey').notEmpty().withMessage('Secret key required') ],
  createSuperadmin
);

export default router;
