// src/middlewares/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




// Dynamic path resolver (relative to project root)
const getUploadPath = (folder) => path.resolve(__dirname, '..', '..', 'uploads', folder);

// -------------------------------
// 1. Storage Configuration
// -------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    switch (file.fieldname) {
      case 'thumbnail':
        folder = 'thumbnails';
        break;
      case 'video':
      case 'demoVideo':
        folder = 'lesson-videos';
        break;
      case 'resource':
        folder = 'lesson-resources';
        break;
      default:
        folder = 'misc';
    }

    const uploadPath = getUploadPath(folder);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// -------------------------------
// 2. File Type Filters
// -------------------------------

// ✅ Filter: Images only (for thumbnails)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, jpeg, gif)'), false);
  }
};

// ✅ Filter: Lesson content (videos, PDFs, PPTs)
const lessonFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'video/mp4',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only MP4, PDF, PPT, PPTX files are allowed'), false);
  }
};

// -------------------------------
// 3. Multer Instances (Exports)
// -------------------------------

// 🖼️ For course/user thumbnails (images only)
export const uploadThumbnail = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// 📹 For lesson videos and resources
export const uploadLessonFile = multer({
  storage,
  fileFilter: lessonFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// 🧩 Generic multer (if you need raw access)
const upload = multer({ storage });

// Default export as object for easy destructuring
export default upload;

// Optional: Export storage/filter for advanced use
export { storage, imageFilter, lessonFileFilter, getUploadPath };
