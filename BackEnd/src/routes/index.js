const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const meetingRoutes = require('./meeting.routes');
const courseRoutes = require('./course.routes');
const enrollmentRoutes = require('./enrollment.routes');

const authMiddleware = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');


router.use('/auth', authRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/admin', adminRoutes);
console.log("Admin routes registered");

router.use('/meetings', meetingRoutes);
router.use('/courses', courseRoutes);

// Example protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You reached a protected route', user: req.user });
});

// Admin-only
router.get('/admin-only', authMiddleware, role(['admin']), (req, res) => {
  res.json({ message: 'Admin area' });
});

module.exports = router;
