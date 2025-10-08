// routes/courseRoutes.js
import express from 'express';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  searchCourses,
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  updateLesson,
  deleteLesson,
  streamLesson,
  markLessonCompleted,
  getProgress,
  getStudentDashboard,
  getUpcomingLessons,
  getInstructorCourseStats
} from '../controllers/courseController.js';
import { uploadThumbnail } from '../middlewares/upload.js'; // Assume upload middleware
import { protect, authorize } from '../middlewares/auth.js';
import { updateCourseStatus } from '../controllers/courseController.js';


const router = express.Router();

// ----------------- COURSE ROUTES -----------------
// POST /api/courses - Create course (instructor/admin/superadmin)
router.post('/', protect, authorize('instructor', 'admin', 'superadmin'), uploadThumbnail.single('thumbnail'), createCourse);

// PUT /api/courses/:courseId - Update course (instructor/admin/superadmin)
router.put('/:courseId', protect, authorize('instructor', 'admin', 'superadmin'), uploadThumbnail.single('thumbnail'), updateCourse);

// DELETE /api/courses/:courseId - Delete course (instructor/admin/superadmin)
router.delete('/:courseId', protect, authorize('instructor', 'admin', 'superadmin'), deleteCourse);

// GET /api/courses/:courseId - Get single course (protected, but can be public if needed)
router.get('/:courseId', protect, getCourse);

// GET /api/courses - Search courses (public, no auth for browsing)
router.get('/', searchCourses);

router.get(
  '/:courseId/progress',
  protect,                 // require login
  authorize('student'),    // only students can access
  getProgress
);
// ----------------- SECTION ROUTES -----------------
// POST /api/courses/:courseId/sections - Create section (instructor/admin/superadmin)
router.post('/:courseId/sections', protect, authorize('instructor', 'admin', 'superadmin'), createSection);

// PUT /api/courses/sections/:sectionId - Update section (instructor/admin/superadmin)
router.put('/:courseId/sections/:sectionId', protect, authorize('instructor', 'admin', 'superadmin'), updateSection);
// DELETE /api/courses/sections/:sectionId - Delete section (instructor/admin/superadmin)
router.delete('/sections/:sectionId', protect, authorize('instructor', 'admin', 'superadmin'), deleteSection);

// ----------------- LESSON ROUTES -----------------
// POST /api/courses/sections/:sectionId/lessons - Create lesson (instructor/admin/superadmin)
router.post('/:courseId/sections/:sectionId/lessons', protect, authorize('instructor', 'admin', 'superadmin'), createLesson);

// PUT /api/courses/lessons/:lessonId - Update lesson (instructor/admin/superadmin)
router.put('/lessons/:lessonId', protect, authorize('instructor', 'admin', 'superadmin'), updateLesson);

// DELETE /api/courses/lessons/:lessonId - Delete lesson (instructor/admin/superadmin)
router.delete('/lessons/:lessonId', protect, authorize('instructor', 'admin', 'superadmin'), deleteLesson);

// ----------------- STUDENT DASHBOARD & PROGRESS -----------------
// GET /api/courses/student/dashboard - Student dashboard (student only)
router.get('/student/dashboard', protect, authorize('student'), getStudentDashboard);

// GET /api/courses/lessons/:lessonId/stream - Stream lesson (student/instructor)
router.get('/lessons/:lessonId/stream', protect, authorize('student', 'instructor'), streamLesson);

// POST /api/courses/lessons/:lessonId/complete - Mark lesson completed (student only)
router.post('/lessons/:lessonId/complete', protect, authorize('student'), markLessonCompleted);

// GET /api/courses/:courseId/progress - Get course progress (student only)
router.get('/courses/:courseId/progress', protect, authorize('student'), getProgress);

// ----------------- INSTRUCTOR / UPCOMING LESSONS -----------------
// GET /api/courses/instructor/upcoming-lessons - Upcoming lessons for instructor
router.get('/instructor/upcoming-lessons', protect, authorize('instructor'), getUpcomingLessons);

// GET /api/courses/instructor/course-stats - Instructor course stats
router.get('/instructor/course-stats', protect, authorize('instructor'), getInstructorCourseStats);

router.patch('/:id/status', protect, updateCourseStatus);

export default router;
