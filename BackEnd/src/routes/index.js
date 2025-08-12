const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.use('/auth', authRoutes);

// Example protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You reached a protected route', user: req.user });
});

// Admin-only 
router.get('/admin-only', authMiddleware, role(['admin']), (req, res) => {
  res.json({ message: 'Admin area' });
});

module.exports = router;