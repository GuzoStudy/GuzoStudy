// controllers/courseController.js
import Course from '../models/Course.js'; 
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js'; 
import Progress from '../models/Progress.js';
import Certificate from '../models/Certificate.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import { createNotification } from './notificationController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, validationResult, param, query } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware
import AuditLog from '../models/AuditLog.js';
import slugify from 'slugify'; // Add this at the top of your file
import { uploadThumbnail } from '../middlewares/upload.js';
// ----------------- MULTER CONFIG -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/thumbnails';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
//export const uploadThumbnail = multer({ 
  //storage, 
  //limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  //fileFilter: (req, file, cb) => {
    //if (file.mimetype.startsWith('image/')) cb(null, true);
    //else cb(new Error('Only images allowed'), false);
  //}
//});

// ----------------- COURSE MANAGEMENT -----------------
// ✅ FIXED createCourse
export const createCourse = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  uploadThumbnail.single('thumbnail'),
  (req, res, next) => {
    console.log('Raw Request Body:', JSON.stringify(req.body, null, 2));
    console.log('File:', req.file);
    console.log('Content-Type:', req.headers['content-type']);

    // Handle multipart/form-data with 'data' field
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Invalid JSON in data field' });
      }
    }
    // Handle multipart/form-data with flat fields
    else if (req.body['pricing[basePrice]'] || req.body['pricing.basePrice']) {
      req.body.pricing = {
        basePrice: parseFloat(req.body['pricing[basePrice]'] || req.body['pricing.basePrice']),
        discountPercentage: parseInt(req.body['pricing[discountPercentage]'] || req.body['pricing.discountPercentage'] || 0),
        currency: req.body['pricing[currency]'] || req.body['pricing.currency'] || 'ETB',
      };
    }
    next();
  },
  body('title').trim().notEmpty().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('description').trim().notEmpty().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('prerequisites').optional().isArray().withMessage('Prerequisites must be an array'),
  body('learningPaths').optional().isArray().withMessage('Learning paths must be an array'),
  body('pricing').notEmpty().withMessage('Pricing is required'),
  body('pricing.basePrice').isFloat({ min: 0 }).withMessage('Base price must be >= 0'),
  body('pricing.discountPercentage').optional().isInt({ min: 0, max: 100 }).withMessage('Discount percentage must be 0-100'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: 'Validation failed. Please provide all required fields.',
        errors: errors.array(),
      });
    }

    const { title, description, category, tags = [], prerequisites = [], learningPaths = [], pricing } = req.body;

    try {
      const courseData = {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description,
        instructor: req.user._id,
        category,
        tags,
        pricing: {
          basePrice: parseFloat(pricing.basePrice),
          discountPercentage: parseInt(pricing.discountPercentage) || 0,
          currency: pricing.currency || 'ETB',
        },
        prerequisites,
        learningPaths,
        createdBy: req.user._id,
      };

      if (req.file) {
        courseData.thumbnail = {
          filename: req.file.filename,
          url: `/uploads/thumbnails/${req.file.filename}`,
        };
      }

      const course = await Course.create(courseData);

      await AuditLog.create({
        action: 'course_created',
        targetId: course._id,
        targetModel: 'Course',
        metadata: { title, pricing: courseData.pricing },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id,
      });

      res.status(201).json(course);
    } catch (err) {
      console.error('Create Course Error:', err);
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: err.message });
    }
  },
];
//FIXED updateCourse
export const updateCourse = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  uploadThumbnail.single('thumbnail'),
  body('title').optional().trim().notEmpty().escape().isLength({ min: 5, max: 200 }),
  body('description').optional().trim().notEmpty().escape().isLength({ min: 10, max: 2000 }),
  body('category').optional().trim().notEmpty().escape(),
  body('tags').optional().isArray(),
  body('prerequisites').optional().isArray(),
  body('learningPaths').optional().isArray(),
  body('pricing.basePrice').optional().isFloat({ min: 0 }),
  body('pricing.discountPercentage').optional().isInt({ min: 0, max: 100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.params;
    const { title, description, category, tags = [], prerequisites = [], learningPaths = [], pricing } = req.body;

    try {
      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) return res.status(404).json({ message: 'Course not found' });
      if (course.instructor.toString() !== req.user._id.toString() && !['admin','superadmin'].includes(req.user.role)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (req.file && course.thumbnail && course.thumbnail.filename) {
        // ✅ FIX: Use the correct path for deletion
        const oldThumbnailPath = path.resolve('./uploads/thumbnails', course.thumbnail.filename);
        if (fs.existsSync(oldThumbnailPath)) {
          fs.unlinkSync(oldThumbnailPath);
        }
        course.thumbnail = {
          filename: req.file.filename,
          url: `/uploads/thumbnails/${req.file.filename}`
        };
      }

      // Update fields
      if (title) course.title = title;
      if (description) course.description = description;
      if (category) course.category = category;
      if (tags.length) course.tags = tags;
      if (prerequisites.length) course.prerequisites = prerequisites;
      if (learningPaths.length) course.learningPaths = learningPaths;
      if (pricing) {
        course.pricing.basePrice = parseFloat(pricing.basePrice);
        course.pricing.discountPercentage = parseInt(pricing.discountPercentage) || 0;
        // Recalculate currentPrice
        if (course.pricing.basePrice > 0 && course.pricing.discountPercentage > 0) {
          course.pricing.currentPrice = Math.round(course.pricing.basePrice * (1 - course.pricing.discountPercentage / 100));
        } else {
          course.pricing.currentPrice = course.pricing.basePrice;
        }
      }

      course.updatedBy = req.user._id;
      await course.save();

      // Notify enrolled students of update
      const enrollments = await Enrollment.find({ 
        course: courseId, 
        paymentStatus: 'completed', 
        isActive: true, 
        isDeleted: false 
      }).populate('user', 'email');
      for (const e of enrollments) {
        await createNotification(
          e.user._id,
          'course_update',
          `Course "${course.title}" has been updated.`,
          courseId,
          'Course'
        );
      }

      // Audit log
      await AuditLog.create({
        action: 'course_updated',
        targetId: course._id,
        targetModel: 'Course',
        metadata: { changes: Object.keys(req.body).join(', ') },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.json(course);
    } catch (err) { 
      console.error('Update Course Error:', err);
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: err.message }); 
    }
  }
];

export const deleteCourse = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId } = req.params;

    try {
      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) return res.status(404).json({ message: 'Course not found' });
      if (course.instructor.toString() !== req.user._id.toString() && !['admin','superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Soft delete course
      course.isDeleted = true;
      course.deletedAt = new Date();
      course.updatedBy = req.user._id;
      await course.save();

      // Soft delete sections and lessons
      const sections = await Section.find({ course: courseId, isDeleted: false });
      for (const sec of sections) {
        sec.isDeleted = true;
        sec.deletedAt = new Date();
        await sec.save();
        await Lesson.updateMany({ section: sec._id }, { 
          isDeleted: true, 
          deletedAt: new Date() 
        });
      }

      // Audit log
      await AuditLog.create({
        action: 'course_deleted',
        targetId: course._id,
        targetModel: 'Course',
        metadata: { sectionsDeleted: sections.length },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json({ message: 'Course and content soft-deleted successfully' });
    } catch (err) { 
      console.error('Delete Course Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

export const getCourse = [
  auth,
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId } = req.params;

    try {
      const course = await Course.findById(courseId, { isDeleted: false })
        .populate({ 
          path: 'sections', 
          match: { isDeleted: false }, 
          options: { sort: { order: 1 } }, 
          populate: { 
            path: 'lessons', 
            match: { isDeleted: false, status: 'published' }, 
            options: { sort: { order: 1 } } 
          } 
        })
        .populate('reviews', 'rating comment user')
        .lean();

      if (!course) return res.status(404).json({ message: 'Course not found' });

      // Check access for students
      if (req.user.role === 'student') {
        const enrollment = await Enrollment.findOne({ 
          user: req.user._id, 
          course: courseId, 
          isActive: true, 
          paymentStatus: 'completed', 
          isDeleted: false 
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      const courseObj = { ...course };
      if (courseObj.thumbnail && courseObj.thumbnail.filename) {
        courseObj.thumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/thumbnails/${courseObj.thumbnail.filename}`;
      }

      // Audit log
      await AuditLog.create({
        action: 'course_viewed',
        targetId: courseId,
        targetModel: 'Course',
        metadata: { userRole: req.user.role },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json(courseObj);
    } catch (err) { 
      console.error('Get Course Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

export const searchCourses = [
  auth,
  query('page').optional().isInt({ min: 1 }).default(1),
  query('limit').optional().isInt({ min: 1, max: 50 }).default(10),
  query('sort').optional().isIn(['newest', 'oldest', 'price_asc', 'price_desc', 'title', 'rating_desc']).default('newest'),
  query('query').optional().trim().escape(),
  query('category').optional().trim().escape(),
  query('tag').optional().trim().escape(),
  query('free').optional().isBoolean(),
  query('discounted').optional().isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { page = 1, limit = 10, sort = 'newest', query, category, tag, free, discounted } = req.query;

    try {
      const filter = { 
        isDeleted: false, 
        status: 'published' 
      };
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ];
      }
      if (category) filter.category = { $regex: category, $options: 'i' };
      if (tag) filter.tags = { $regex: tag, $options: 'i' };
      if (free === 'true') filter['pricing.basePrice'] = 0;
      if (discounted === 'true') filter['pricing.discountPercentage'] = { $gt: 0 };

      let sortOption = { createdAt: -1 };
      switch (sort) {
        case 'newest': sortOption = { createdAt: -1 }; break;
        case 'oldest': sortOption = { createdAt: 1 }; break;
        case 'price_asc': sortOption = { 'pricing.currentPrice': 1 }; break;
        case 'price_desc': sortOption = { 'pricing.currentPrice': -1 }; break;
        case 'title': sortOption = { title: 1 }; break;
        case 'rating_desc': sortOption = { averageRating: -1 }; break;
        default: sortOption = { createdAt: -1 };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const courses = await Course.find(filter)
        .populate('instructor', 'fullName')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Add thumbnail URLs
      courses.forEach(course => {
        if (course.thumbnail && course.thumbnail.filename) {
          course.thumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/thumbnails/${course.thumbnail.filename}`;
        }
      });

      const total = await Course.countDocuments(filter);

      // Audit log
      await AuditLog.create({
        action: 'courses_searched',
        targetId: null,
        targetModel: 'Course',
        metadata: { results: courses.length, filters: { query, category, tag, free, discounted } },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.json({ 
        total, 
        page: parseInt(page), 
        pages: Math.ceil(total / parseInt(limit)), 
        courses 
      });
    } catch (err) { 
      console.error('Search Courses Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

// ----------------- SECTION MANAGEMENT -----------------
export const createSection = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  body('title').trim().notEmpty().escape().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId } = req.params;
    let { title, order } = req.body;

    try {
      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) return res.status(404).json({ message: 'Course not found' });
      if (course.instructor.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Automatically assign the next available order if not provided or conflicting
      if (order === undefined || order === null) {
        const maxOrder = await Section.find({ course: courseId, isDeleted: false })
          .sort({ order: -1 })
          .limit(1)
          .select('order');
        order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;
      } else {
        // Check for unique order
        const existingSection = await Section.findOne({ 
          course: courseId, 
          order: parseInt(order), 
          isDeleted: false 
        });
        if (existingSection) {
          // Find the next available order
          const maxOrder = await Section.find({ course: courseId, isDeleted: false })
            .sort({ order: -1 })
            .limit(1)
            .select('order');
          order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;
        }
      }

      const section = new Section({ 
        course: courseId, 
        title, 
        order: parseInt(order),
        createdBy: req.user._id
      });
      await section.save();

      course.sections.push(section._id);
      course.updatedBy = req.user._id;
      await course.save();

      await AuditLog.create({
        action: 'section_created',
        targetId: section._id,
        targetModel: 'Section',
        metadata: { course: courseId, title, order },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(201).json(section);
    } catch (err) { 
      console.error('Create Section Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];
export const updateSection = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  param('sectionId').isMongoId().withMessage('Valid section ID required'),
  body('title').optional().trim().notEmpty().escape().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, sectionId } = req.params;
    const { title, order } = req.body;

    console.log('Request Params:', { courseId, sectionId });
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);

    try {
      const section = await Section.findOne({ _id: sectionId, course: courseId, isDeleted: false });
      if (!section) return res.status(404).json({ message: 'Section not found' });

      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) return res.status(404).json({ message: 'Course not found' });
      if (course.instructor.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      let newOrder = section.order; // Preserve existing order by default
      if (order !== undefined && order !== section.order) {
        const existingSection = await Section.findOne({ 
          course: courseId, 
          order: parseInt(order), 
          isDeleted: false,
          _id: { $ne: section._id }
        });
        if (existingSection) {
          const maxOrder = await Section.find({ course: courseId, isDeleted: false })
            .sort({ order: -1 })
            .limit(1)
            .select('order');
          newOrder = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;
          console.log(`Order conflict detected. Assigning new order: ${newOrder}`);
        } else {
          newOrder = parseInt(order);
        }
      }

      console.log('Existing Sections:', await Section.find({ course: courseId, isDeleted: false }).select('title order _id'));

      if (title) section.title = title;
      if (newOrder !== section.order) section.order = newOrder;
      section.updatedBy = req.user._id;

      await section.save();

      course.updatedBy = req.user._id;
      await course.save();

      console.log('Creating AuditLog with targetModel: Section');
      await AuditLog.create({
        action: 'section_updated',
        targetId: section._id,
        targetModel: 'Section',
        metadata: { course: courseId, changes: Object.keys(req.body).join(', ') },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json(section);
    } catch (err) { 
      console.error('Update Section Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];
export const deleteSection = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('sectionId').isMongoId().withMessage('Valid section ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { sectionId } = req.params;

    try {
      const section = await Section.findById(sectionId, { isDeleted: false })
        .populate('course', 'instructor');
      if (!section) return res.status(404).json({ message: 'Section not found' });
      if (section.course.instructor.toString() !== req.user._id.toString() && !['admin','superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Soft delete section
      section.isDeleted = true;
      section.deletedAt = new Date();
      section.updatedBy = req.user._id;
      await section.save();

      // Soft delete lessons
      await Lesson.updateMany({ 
        section: sectionId, 
        isDeleted: false 
      }, { 
        isDeleted: true, 
        deletedAt: new Date() 
      });

      // Remove from course sections array
      await Course.updateOne(
        { _id: section.course._id, sections: sectionId },
        { $pull: { sections: sectionId } }
      );

      // Audit log
      await AuditLog.create({
        action: 'section_deleted',
        targetId: section._id,
        targetModel: 'Section',
        metadata: { course: section.course._id },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json({ message: 'Section and lessons soft-deleted successfully' });
    } catch (err) { 
      console.error('Delete Section Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

// ----------------- LESSON MANAGEMENT -----------------
export const createLesson = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  param('sectionId').isMongoId().withMessage('Valid section ID required'),
  body('title').trim().notEmpty().escape().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('contentType').trim().notEmpty().isIn(['video', 'text', 'quiz']).withMessage('Content type must be video, text, or quiz'),
  body('content').notEmpty().withMessage('Content is required').isObject().withMessage('Content must be an object'),
  body('content.url').if(body('contentType').equals('video')).notEmpty().withMessage('URL is required for video content'),
  body('content.filename').if(body('contentType').equals('video')).notEmpty().withMessage('Filename is required for video content'),
  body('content.body').if(body('contentType').equals('text')).notEmpty().withMessage('Body is required for text content'),
  body('content.questions').if(body('contentType').equals('quiz')).isArray({ min: 1 }).withMessage('Questions array is required for quiz content'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a non-negative integer'),
  body('isPreview').optional().isBoolean().withMessage('isPreview must be a boolean'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, sectionId } = req.params;
    let { title, contentType, content, order, duration, isPreview } = req.body;

    console.log('Request URL:', req.originalUrl);
    console.log('Request Params:', { courseId, sectionId });
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);

    try {
      const section = await Section.findOne({ _id: sectionId, course: courseId, isDeleted: false });
      if (!section) {
        console.log('Section not found:', { sectionId, courseId });
        return res.status(404).json({ message: 'Section not found' });
      }

      const course = await Course.findById(courseId, { isDeleted: false });
      if (!course) {
        console.log('Course not found:', { courseId });
        return res.status(404).json({ message: 'Course not found' });
      }
      if (course.instructor.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
        console.log('Unauthorized access:', { userId: req.user._id, courseInstructor: course.instructor });
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (order === undefined || order === null) {
        const maxOrder = await Lesson.find({ section: sectionId, isDeleted: false })
          .sort({ order: -1 })
          .limit(1)
          .select('order');
        order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;
      } else {
        const existingLesson = await Lesson.findOne({ 
          section: sectionId, 
          order: parseInt(order), 
          isDeleted: false 
        });
        if (existingLesson) {
          const maxOrder = await Lesson.find({ section: sectionId, isDeleted: false })
            .sort({ order: -1 })
            .limit(1)
            .select('order');
          order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;
          console.log(`Order conflict detected. Assigning new order: ${order}`);
        } else {
          order = parseInt(order);
        }
      }

      console.log('Existing Lessons:', await Lesson.find({ section: sectionId, isDeleted: false }).select('title order _id'));

      const lesson = new Lesson({
        section: sectionId,
        course: courseId,
        title,
        contentType,
        content,
        order,
        duration,
        isPreview: isPreview || false,
        createdBy: req.user._id
      });

      await lesson.save();

      section.lessons.push(lesson._id);
      section.updatedBy = req.user._id;
      await section.save();

      course.updatedBy = req.user._id;
      await course.save();

      console.log('Creating AuditLog with targetModel: Lesson');
      await AuditLog.create({
        action: 'lesson_created',
        targetId: lesson._id,
        targetModel: 'Lesson',
        metadata: { course: courseId, section: sectionId, title, contentType, order },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(201).json(lesson);
    } catch (err) {
      console.error('Create Lesson Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];
export const updateLesson = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('lessonId').isMongoId().withMessage('Valid lesson ID required'),
  body('title').optional().trim().notEmpty().escape().isLength({ min: 3, max: 150 }),
  body('contentType').optional().isIn(['video', 'text', 'quiz', 'assignment', 'audio']),
  body('duration').optional().isFloat({ min: 0 }),
  body('order').optional().isInt({ min: 0 }),
  body('textContent.html').optional().escape(),
  body('video.url').optional().isURL(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { lessonId } = req.params;
    const { title, contentType, duration, order, textContent, video } = req.body;

    try {
      const lesson = await Lesson.findById(lessonId, { isDeleted: false })
        .populate({ path: 'section', populate: 'course' });
      if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
      if (lesson.section.course.instructor.toString() !== req.user._id.toString() && !['admin','superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (title) lesson.title = title;
      if (contentType) lesson.contentType = contentType;
      if (duration !== undefined) lesson.duration = parseFloat(duration);
      if (order !== undefined) {
        // Check unique order
        const existingLesson = await Lesson.findOne({ 
          section: lesson.section._id, 
          order: parseInt(order), 
          _id: { $ne: lessonId }, 
          isDeleted: false 
        });
        if (existingLesson) {
          return res.status(400).json({ message: 'Order must be unique per section' });
        }
        lesson.order = parseInt(order);
      }
      if (textContent) lesson.textContent = { html: textContent.html || '' };
      if (video) lesson.video = {
        url: video.url,
        filename: video.filename || '',
        fileSize: parseInt(video.fileSize) || 0,
        mimeType: video.mimeType || 'video/mp4'
      };

      lesson.updatedBy = req.user._id;
      await lesson.save();

      // Audit log
      await AuditLog.create({
        action: 'lesson_updated',
        targetId: lesson._id,
        targetModel: 'Lesson',
        metadata: { changes: Object.keys(req.body).join(', ') },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.json(lesson);
    } catch (err) { 
      console.error('Update Lesson Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

export const deleteLesson = [
  auth,
  requireRole(['instructor', 'admin', 'superadmin']),
  param('lessonId').isMongoId().withMessage('Valid lesson ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { lessonId } = req.params;

    try {
      const lesson = await Lesson.findById(lessonId, { isDeleted: false })
        .populate({ path: 'section', populate: 'course' });
      if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
      if (lesson.section.course.instructor.toString() !== req.user._id.toString() && !['admin','superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Soft delete lesson
      lesson.isDeleted = true;
      lesson.deletedAt = new Date();
      lesson.updatedBy = req.user._id;
      await lesson.save();

      // Remove from section lessons array
      await Section.updateOne(
        { _id: lesson.section._id, lessons: lessonId },
        { $pull: { lessons: lessonId } }
      );

      // Soft delete related progress
      await Progress.updateMany({ 
        lesson: lessonId, 
        isDeleted: false 
      }, { 
        isDeleted: true, 
        deletedAt: new Date() 
      });

      // Audit log
      await AuditLog.create({
        action: 'lesson_deleted',
        targetId: lesson._id,
        targetModel: 'Lesson',
        metadata: { section: lesson.section._id },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json({ message: 'Lesson soft-deleted successfully' });
    } catch (err) { 
      console.error('Delete Lesson Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

// ----------------- STUDENT DASHBOARD & PROGRESS -----------------
export const streamLesson = [
  auth,
  requireRole(['student', 'instructor', 'admin', 'superadmin']),
  async (req, res) => {
    const { lessonId } = req.params;

    try {
      // Fetch the lesson that is not deleted and is published
      const lesson = await Lesson.findOne({ 
        _id: lessonId,
        isDeleted: false,
        //status: 'published'
      }).populate('course');

      if (!lesson) return res.status(404).json({ message: 'Lesson not found or not published' });

      const course = lesson.course;

      // Students must be enrolled to stream
      if (req.user.role === 'student') {
        const enrollment = await Enrollment.findOne({ 
          user: req.user._id,
          course: course._id,
          isActive: true,
          paymentStatus: 'completed'
        });
        if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      // Streaming response (example: return video URL / lesson content)
      res.json({
        lessonId: lesson._id,
        title: lesson.title,
        contentUrl: lesson.videoUrl, // or whatever field you have
        description: lesson.description,
        duration: lesson.duration
      });
    } catch (err) {
      console.error('Stream Lesson Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

export const markLessonCompleted = [
  auth,
  requireRole(['student']),
  param('lessonId').isMongoId().withMessage('Valid lesson ID required'),
  body('timeSpent').optional().isFloat({ min: 0 }).withMessage('Time spent must be positive'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { lessonId } = req.params;
    const { _id: userId } = req.user;
    const { timeSpent = 0 } = req.body;

    try {
      const lesson = await Lesson.findById(lessonId, { isDeleted: false })
        .populate('section', 'course title order')
        .lean();
      if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

      const enrollment = await Enrollment.findOne({
        user: userId,
        course: lesson.section.course,
        isActive: true,
        paymentStatus: 'completed',
        isDeleted: false
      });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });

      const progress = await Progress.findOneAndUpdate(
        { user: userId, enrollment: enrollment._id, lesson: lessonId },
        { 
          status: 'completed', 
          completedAt: new Date(),
          timeSpent,
          lastAccessedAt: new Date(),
          updatedBy: userId
        },
        { upsert: true, new: true }
      ).lean();

      // Increment lesson completion count
      await Lesson.findByIdAndUpdate(lessonId, { 
        $inc: { 'analytics.completionCount': 1 },
        updatedBy: userId 
      });

      // Update average time spent
      const currentLesson = await Lesson.findById(lessonId);
      const totalCompletions = currentLesson.analytics.completionCount;
      const newAvg = totalCompletions > 1 ? ((currentLesson.analytics.averageTimeSpent * (totalCompletions - 1) + timeSpent) / totalCompletions) : timeSpent;
      await Lesson.findByIdAndUpdate(lessonId, { 'analytics.averageTimeSpent': newAvg });

      // Audit log
      await AuditLog.create({
        action: 'lesson_completed',
        targetId: progress._id,
        targetModel: 'Progress',
        metadata: { lesson: lessonId, timeSpent },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: userId
      });

      res.json({ message: 'Lesson marked as completed', progress });
    } catch (err) { 
      console.error('Mark Lesson Completed Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

export const getProgress = [
  auth,
  requireRole(['student']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId } = req.params;
    const { _id: userId } = req.user;

    try {
      const enrollment = await Enrollment.findOne({ 
        user: userId, 
        course: courseId, 
        isActive: true, 
        isDeleted: false 
      });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });

      const progress = await Progress.find({ 
        enrollment: enrollment._id, 
        isDeleted: false 
      })
        .populate('lesson', 'title contentType duration')
        .populate('quiz', 'title totalMarks passingScore')
        .sort({ completedAt: -1, lastAccessedAt: -1 });

      // Calculate overall stats
      const totalItems = progress.length;
      const completedItems = progress.filter(p => p.status === 'completed').length;
      const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

      res.json({ 
        progress,
        stats: { overallProgress, totalItems, completedItems, totalTimeSpent }
      });
    } catch (err) { 
      console.error('Get Progress Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];
export const getStudentDashboard = [
  auth,
  requireRole(['student']),
  async (req, res) => {
    const userId = req.user._id;

    try {
      // 1️⃣ Enrolled courses with completion %
      const enrollments = await Enrollment.find({ 
        user: userId, 
        paymentStatus: 'completed', 
        isActive: true, 
        isDeleted: false 
      })
        .populate({
          path: 'course',
          match: { isDeleted: false, status: 'published' },
          populate: { 
            path: 'sections', 
            populate: { 
              path: 'lessons quizzes', 
              match: { isDeleted: false, status: 'published' } 
            } 
          }
        })
        .sort({ enrolledAt: -1 });

      const enrolledCourses = await Promise.all(enrollments.map(async (enrollment) => {
        const course = enrollment.course;
        if (!course) return null; // Filter invalid

        // Calculate completion using Progress
        const progressEntries = await Progress.find({ 
          enrollment: enrollment._id, 
          isDeleted: false 
        }).lean();
        const totalItems = progressEntries.length;
        const completedItems = progressEntries.filter(p => p.status === 'completed').length;
        const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        // Upcoming lesson: first incomplete
        let upcomingLesson = null;
        for (const section of course.sections || []) {
          for (const lesson of section.lessons || []) {
            const done = progressEntries.find(p => p.lesson && p.lesson.toString() === lesson._id.toString() && p.status === 'completed');
            if (!done) {
              upcomingLesson = {
                lessonId: lesson._id,
                title: lesson.title,
                courseId: course._id,
                courseTitle: course.title
              };
              break;
            }
          }
          if (upcomingLesson) break;
        }

        return {
          _id: course._id,
          title: course.title,
          thumbnailUrl: course.thumbnail ? `${req.protocol}://${req.get('host')}/uploads/thumbnails/${course.thumbnail.filename || course.thumbnail}` : null,
          completionPercentage,
          upcomingLesson
        };
      })).then(results => results.filter(Boolean));

      // 2️⃣ Quiz scores (recent)
      const quizScores = await QuizSubmission.find({ 
        user: userId, 
        isDeleted: false, 
        status: 'graded' 
      })
        .populate('quiz', 'title')
        .sort({ completedAt: -1 })
        .limit(5)
        .lean();

      // 3️⃣ Certificates
      const certificates = await Certificate.find({ 
        user: userId, 
        status: 'issued', 
        isDeleted: false 
      })
        .populate('course', 'title')
        .sort({ issuedAt: -1 })
        .limit(3)
        .lean();

      // 4️⃣ Latest notifications
      const notifications = await Notification.find({ 
        user: userId, 
        read: false, 
        isDeleted: false, 
        expiresAt: { $gt: new Date() } 
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      res.json({
        enrolledCourses,
        quizScores,
        certificates,
        notifications,
        timestamp: new Date().toISOString()
      });
    } catch (err) { 
      console.error('Get Student Dashboard Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

// ----------------- INSTRUCTOR / UPCOMING LESSONS -----------------
export const getUpcomingLessons = [
  auth,
  requireRole(['student', 'instructor']),
  async (req, res) => {
    const { _id: userId, role: userRole } = req.user;

    try {
      let lessons;
      if (userRole === 'student') {
        const enrollments = await Enrollment.find({ 
          user: userId, 
          paymentStatus: 'completed', 
          isActive: true, 
          isDeleted: false 
        });
        const courseIds = enrollments.map(e => e.course);
        lessons = await Lesson.find({ 
          'section.course': { $in: courseIds }, 
          isDeleted: false, 
          status: 'published' 
        })
          .populate('section', 'title course')
          .sort({ order: 1 }); // Section order
      } else if (userRole === 'instructor') {
        const courses = await Course.find({ 
          instructor: userId, 
          isDeleted: false, 
          status: 'published' 
        });
        const courseIds = courses.map(c => c._id);
        lessons = await Lesson.find({ 
          'section.course': { $in: courseIds }, 
          isDeleted: false, 
          status: 'published' 
        })
          .populate('section', 'title course')
          .sort({ 'section.order': 1, order: 1 });
      } else {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      res.json({ upcomingLessons: lessons });
    } catch (err) { 
      console.error('Get Upcoming Lessons Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

export const getInstructorCourseStats = [
  auth,
  requireRole(['instructor']),
  async (req, res) => {
    const instructorId = req.user._id;

    try {
      const courses = await Course.find({ 
        instructor: instructorId, 
        isDeleted: false, 
        status: 'published' 
      }).lean();

      const courseIds = courses.map(c => c._id);
      const enrollments = await Enrollment.find({ 
        course: { $in: courseIds }, 
        paymentStatus: 'completed', 
        isDeleted: false 
      });
      const enrollmentCount = enrollments.length;

      const payments = await Payment.find({ 
        course: { $in: courseIds }, 
        status: 'completed', 
        isDeleted: false 
      });
      const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
      const instructorShare = payments.reduce((acc, p) => acc + (p.instructorShare || 0), 0);

      const progress = await Progress.find({ 
        course: { $in: courseIds }, 
        status: 'completed', 
        isDeleted: false 
      });
      const completedStudents = new Set(progress.map(p => p.user.toString())).size;

      // Audit log
      await AuditLog.create({
        action: 'instructor_stats_viewed',
        targetId: instructorId,
        targetModel: 'User',
        metadata: { courses: courses.length, enrollments: enrollmentCount },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: instructorId
      });

      res.json({ 
        courseCount: courses.length, 
        enrollmentCount, 
        totalRevenue: parseFloat(totalRevenue.toFixed(2)), 
        instructorShare: parseFloat(instructorShare.toFixed(2)), 
        completedStudents 
      });
    } catch (err) { 
      console.error('Get Instructor Course Stats Error:', err);
      res.status(500).json({ message: err.message }); 
    }
  }
];

export const getAllCertificates = [
  auth,
  requireRole(['admin', 'superadmin']),
  async (req, res) => {
    try {
      const certificates = await Certificate.find({ isDeleted: false })
        .populate('user', 'fullName email profilePicture')
        .populate('course', 'title thumbnail')
        .select('certificateId issuedAt status revoked revokedAt fileUrl')
        .sort({ issuedAt: -1 });

      res.status(200).json(certificates);
    } catch (err) {
      console.error('Get All Certificates Error:', err);
      res.status(500).json({ message: err.message });
    }
  }
];


export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. "published", "pending", "draft", "rejected"

    const allowedStatuses = ['draft', 'pending', 'published', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: `Course status updated to ${status}`, course });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
