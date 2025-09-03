const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: [
      {
        lessonId: { type: mongoose.Schema.Types.ObjectId },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
