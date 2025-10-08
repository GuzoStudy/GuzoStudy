// src/app.js
import dotenv from 'dotenv';
dotenv.config();

// Validate all required secrets
const requiredSecrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGO_URI'];
for (const secret of requiredSecrets) {
  if (!process.env[secret]) {
    console.error(`❌ Missing required env var: ${secret}`);
    process.exit(1);
  }
}

import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import rateLimit from 'express-rate-limit';
import listEndpoints from 'express-list-endpoints';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';
import superadminRoutes from './routes/superadminRoutes.js';
import bodyParser from 'body-parser';
console.log('GMAIL_USERNAME:', process.env.GMAIL_USERNAME);
console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '****' : 'undefined');

connectDB();

const app = express();
app.use(express.json());

// Rate limiter: 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Rate limit exceeded. Try again in a minute.',
});
app.use('/api/users/register', limiter);
app.use('/api/users/forgot-password', limiter);
app.use('/uploads', express.static(path.resolve('./uploads')));
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/courses/:courseId/discussions', discussionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: err.message });
});

// Log all registered routes
console.log("📌 Registered Routes:");
console.table(listEndpoints(app));
console.log('✅ BASE_URL:', process.env.BASE_URL);
console.log('✅ FRONTEND_URL:', process.env.FRONTEND_URL);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
