// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import rateLimit from 'express-rate-limit';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
console.log('GMAIL_USERNAME:', process.env.GMAIL_USERNAME);
console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '****' : 'undefined');

connectDB();

const app = express();
app.use(express.json());

/* ========================
   ✅ CORS CONFIGURATION
   ======================== */
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vite dev server
      process.env.FRONTEND_URL, // optional: your deployed frontend
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Preflight requests (OPTIONS)
app.options('*', cors());

/* ========================
   ✅ RATE LIMITING
   ======================== */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Rate limit exceeded. Try again in a minute.',
});
app.use('/api/users/register', limiter);
app.use('/api/users/forgot-password', limiter);

/* ========================
   ✅ ROUTES
   ======================== */
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', chatRoutes); // Chat routes

/* ========================
   ✅ ERROR HANDLER
   ======================== */
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: err.message });
});

/* ========================
   ✅ ROUTE LOGGER
   ======================== */
console.log('📌 Registered Routes:');
console.table(listEndpoints(app));

/* ========================
   ✅ START SERVER
   ======================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
