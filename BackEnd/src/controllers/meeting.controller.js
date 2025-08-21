const Meeting = require('../models/meeting.model');
const Course = require('../models/course.model');

// Create meeting (teacher only)
exports.createMeeting = async (req, res) => {
  try {
    const { courseId, title, startTime, durationMinutes } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only teacher of the course can create meetings
    if (course.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not course owner' });

    const meetingUrl = `https://meet.jit.si/${courseId}-${Date.now()}`;

    const meeting = await Meeting.create({
      course: courseId,
      title,
      startTime,
      durationMinutes,
      meetingUrl,
      createdBy: req.user.id,
    });

    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get meetings for a course (enrolled students & teacher only)
exports.getMeetings = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const meetings = await Meeting.find({ course: courseId }).sort({ startTime: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
