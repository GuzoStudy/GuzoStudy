// routes/adminRoutes.js
import express from 'express';
import {
  manageCourses,
  getPlatformAnalytics,
  managePayments,
  manageReportedContent,
  viewAuditLogs,
  manageUsers,
  manageRefunds, // Add for finance
  updateSiteSettings // Add for settings
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { createAdmin, createSuperadmin } from '../controllers/userController.js';

const router = express.Router();

// Superadmin-only routes
router.post('/create-admin', protect, authorize('superadmin'), createAdmin);
router.post('/create-superadmin', protect, authorize('superadmin'), createSuperadmin);

// Admin/superadmin-only routes
router.use(protect);
router.use(authorize('admin', 'superadmin'));

// ----------------- Course Management -----------------
router.put('/courses/manage', manageCourses);

// ----------------- Platform Analytics -----------------
router.get('/analytics', getPlatformAnalytics);

// ----------------- Payment Management -----------------
router.put('/payments/manage', managePayments);

// ----------------- Reported Content -----------------
router.put('/reported/manage', manageReportedContent);

// ----------------- Audit Logs -----------------
router.get('/audit-logs', viewAuditLogs);

// ----------------- User Management -----------------
router.put('/users/manage', manageUsers);

// ----------------- Finance & Refunds -----------------
router.get('/refunds', manageRefunds); // GET pending refunds
router.put('/refunds/:id', manageRefunds); // Process refund

// ----------------- Settings -----------------
router.put('/settings/site', updateSiteSettings); // Update site settings

export default router;