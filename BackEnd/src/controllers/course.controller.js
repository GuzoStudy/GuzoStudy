const Course = require("../models/course.model");

const Enrollment = require("../models/enrollment.model");



// Create course (Teacher)
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new Course({
      title,
      description,
      teacher: req.user.id,
      students: [],
      lessons: [],
      progress: {} // track student progress
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Error creating course", error: err.message });
  }
};

// Add lesson (Teacher)
exports.addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only teacher who owns the course
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newLesson = { title, content };
    course.lessons.push(newLesson);
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error adding lesson", error: err.message });
  }
};


// Enroll in course (Student)
exports.enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: id,
    });

    if (existingEnrollment) {
      return res.json({ message: "Already enrolled", course });
    }

    // Create enrollment record
    const enrollment = new Enrollment({
      student: req.user.id,
      course: id,
      progress: course.lessons.map((lesson) => ({
        lessonId: lesson._id,
        completed: false,
      })),
    });
    await enrollment.save();

    // Update course enrolledStudents list
    if (!course.enrolledStudents.includes(req.user.id)) {
      course.enrolledStudents.push(req.user.id);
      await course.save();
    }

    res.json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error enrolling in course", error: err.message });
  }
};

// Complete lesson (Student)
exports.completeLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params; // courseId and lessonId

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: id,
    });
    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    // Find lesson progress entry
    const lessonProgress = enrollment.progress.find(
      (p) => p.lessonId.toString() === lessonId
    );

    if (!lessonProgress) {
      return res.status(404).json({ message: "Lesson not found in progress" });
    }

    lessonProgress.completed = true;
    await enrollment.save();

    res.json({
      message: `Lesson ${lessonId} marked as completed`,
      progress: enrollment.progress,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error completing lesson", error: err.message });
  }
};

// Get course progress (Student)
exports.getProgress = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: id,
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    const completedLessons = enrollment.progress.filter((p) => p.completed)
      .length;
    const totalLessons = enrollment.progress.length;
    const progressPercent =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    res.json({
      courseId: id,
      studentId: req.user.id,
      completedLessons,
      totalLessons,
      progressPercent: progressPercent.toFixed(2) + "%",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching progress", error: err.message });
  }
};

// Search courses (Public)
exports.searchCourses = async (req, res) => {
  try {
    const { q } = req.query;
    const courses = await Course.find({
      title: { $regex: q || "", $options: "i" }
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error searching courses", error: err.message });
  }
};
