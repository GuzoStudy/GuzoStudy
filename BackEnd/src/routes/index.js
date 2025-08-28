const express = require('express');
const router = express.Router();
console.log(">> index.js is being executed");

const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const meetingRoutes = require('./meeting.routes');
const courseRoutes = require('./course.routes');
const enrollmentRoutes = require('./enrollment.routes');

const requireAuth = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.use('/auth', authRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/admin', adminRoutes);
console.log("Admin routes registered");
router.use('/meetings', meetingRoutes);
router.use('/courses', courseRoutes);

// Example protected route (auth only)
router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'You reached a protected route', user: req.user });
});

// Admin-only
router.get('/admin-only', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({ message: 'Admin area' });
});

console.log(">> Exporting router with paths:", router.stack.map(r => r.route?.path || r.name));
module.exports = router;
