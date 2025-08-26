const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");

// ----------------- TEACHER FEATURES -----------------

// Update course (Teacher)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();

    res.json({ message: "Course updated", course });
  } catch (err) {
    res.status(500).json({ message: "Error updating course", error: err.message });
  }
};

// Delete course (Teacher)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Enrollment.deleteMany({ course: id }); // clean up enrollments
    await course.deleteOne();

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course", error: err.message });
  }
};

// Update lesson (Teacher)
exports.updateLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const { title, content } = req.body;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    await course.save();

    res.json({ message: "Lesson updated", course });
  } catch (err) {
    res.status(500).json({ message: "Error updating lesson", error: err.message });
  }
};

// Delete lesson (Teacher)
exports.deleteLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    course.lessons = course.lessons.filter((l) => l._id.toString() !== lessonId);
    await course.save();

    res.json({ message: "Lesson deleted", course });
  } catch (err) {
    res.status(500).json({ message: "Error deleting lesson", error: err.message });
  }
};

// Teacher’s created courses
exports.getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teacher courses", error: err.message });
  }
};

// ----------------- STUDENT FEATURES -----------------

// Student’s enrolled courses
exports.getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate("course");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student courses", error: err.message });
  }
};

// ----------------- PUBLIC FEATURES -----------------

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};

// Get single course
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate("teacher", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course", error: err.message });
  }
};
