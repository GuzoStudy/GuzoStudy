const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { id } = req.params; // Changed from courseId to id to match route parameter

    // check if course exists
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // check if already enrolled
    const existing = await Enrollment.findOne({ student: req.user.id, course: id });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = new Enrollment({ student: req.user.id, course: id });
    await enrollment.save();

    // increment course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    res.status(500).json({ message: "Error enrolling in course", error: err.message });
  }
};

// Get student's enrolled courses
exports.getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate("course");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student courses", error: err.message });
  }
};

// Get progress for a specific course
exports.getProgress = async (req, res) => { // ADD THIS MISSING FUNCTION
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findOne({ 
      student: req.user.id, 
      course: id 
    }).populate("course");
    
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in this course" });
    }
    
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress", error: err.message });
  }
};

// Mark lesson as completed
exports.completeLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params; // Changed from courseId to id to match route parameter
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: id });

    if (!enrollment) return res.status(404).json({ message: "Not enrolled in this course" });

    let progress = enrollment.progress.find(p => p.lessonId.toString() === lessonId);

    if (progress) {
      progress.completed = true;
    } else {
      enrollment.progress.push({ lessonId, completed: true });
    }

    await enrollment.save();
    res.json({ message: "Lesson marked as completed", enrollment });
  } catch (err) {
    res.status(500).json({ message: "Error updating progress", error: err.message });
  }
};