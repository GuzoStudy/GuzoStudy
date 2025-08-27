const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,        // stored video link (e.g. S3, Cloudinary, etc.)
  fileUrl: String,         // downloadable file (PDF, slides, etc.)
  order: { type: Number, default: 0 }, // lesson order inside the course
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  category: { type: String, required: true },   // e.g. Programming, Business, etc.
  tags: [String],                               // e.g. ["React", "Node", "Web Dev"]
  language: { type: String, default: "English" },

  price: { type: Number, default: 0 },          // 0 = free course
  thumbnail: String,

  lessons: [LessonSchema],

  reviews: [ReviewSchema],
  averageRating: { type: Number, default: 0 },

  enrollmentCount: { type: Number, default: 0 },

}, { timestamps: true });

// Auto-update averageRating before saving course
CourseSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = total / this.reviews.length;
  }
  return this.averageRating;
};

module.exports = mongoose.model("Course", CourseSchema);

