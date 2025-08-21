const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,  // hosted/streaming link
  fileUrl: String,   // downloadable file
  order: { type: Number, default: 0 },
});

const liveSessionSchema = new mongoose.Schema({
  title: String,
  scheduledAt: Date,
  duration: Number,       // in minutes
  meetingLink: String,    // Jitsi/Zoom/WebRTC
  recordingUrl: String,   // if available
});

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson: { type: mongoose.Schema.Types.ObjectId },
  completed: { type: Boolean, default: false },
  completedAt: Date,
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    thumbnailUrl: String,
    lessons: [lessonSchema],
    liveSessions: [liveSessionSchema],   // 🔥 New: live video support
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    progress: [progressSchema],
    tags: [String],
    price: { type: Number, default: 0 }, // 0 = free
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
