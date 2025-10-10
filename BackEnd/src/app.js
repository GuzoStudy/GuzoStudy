// src/app.js
import dotenv from 'dotenv';
dotenv.config();

// ✅ Validate required secrets
const requiredSecrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGO_URI'];
for (const secret of requiredSecrets) {
  if (!process.env[secret]) {
    console.error(`❌ Missing required env var: ${secret}`);
    process.exit(1);
  }
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import listEndpoints from 'express-list-endpoints';
import connectDB from './config/db.js';

// ✅ Route imports
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
import chatRoutes from './routes/chatRoutes.js';


// ✅ Connect MongoDB
connectDB();

const app = express();

// ✅ CORS setup: allow local frontend only
app.use(
  cors({
    origin: 'http://localhost:5173', // your Vite frontend
    credentials: true,
  })
);

// ✅ Core middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Debug email envs
console.log('GMAIL_USERNAME:', process.env.GMAIL_USERNAME);
console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '****' : 'undefined');

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Rate limit exceeded. Try again in a minute.',
});
app.use('/api/users/register', limiter);
app.use('/api/users/forgot-password', limiter);

// ✅ Static uploads
app.use('/uploads', express.static(path.resolve('./uploads')));

// ✅ Routes
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
app.use('/api', chatRoutes); // Chat routes

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: err.message });
});

// ✅ Debug info
console.log('📌 Registered Routes:');
console.table(listEndpoints(app));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
