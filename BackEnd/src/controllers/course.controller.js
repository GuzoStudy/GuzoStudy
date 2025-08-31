const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");

// ----------------- TEACHER FEATURES -----------------
// Create course (Teacher)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, tags, language, price, thumbnail } = req.body;

    const newCourse = new Course({
      title,
      description,
      category,
      tags,
      language,
      price,
      thumbnail,
      teacher: req.user.id, // from auth middleware
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    res.status(500).json({ message: "Error creating course", error: err.message });
  }
};
// Add lesson (Teacher)
exports.createLesson = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const { title, description, videoUrl, fileUrl, order } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newLesson = {
      title,
      description,
      videoUrl,
      fileUrl,
      order: order || course.lessons.length + 1,
    };

    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({ message: "Lesson added successfully", course });
  } catch (err) {
    res.status(500).json({ message: "Error adding lesson", error: err.message });
  }
};


// Update course (Teacher)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, language, price, thumbnail } = req.body;

    // Build update object dynamically
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (tags !== undefined) updateFields.tags = tags;
    if (language !== undefined) updateFields.language = language;
    if (price !== undefined) updateFields.price = price;
    if (thumbnail !== undefined) updateFields.thumbnail = thumbnail;

    const course = await Course.findOneAndUpdate(
      { _id: id, teacher: req.user.id }, // ensures only teacher can update
      { $set: updateFields },
      { new: true, runValidators: true } // return updated doc, validate only provided fields
    );

    if (!course) return res.status(404).json({ message: "Course not found or not authorized" });

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
// Update lesson (Teacher)
exports.updateLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const { title, description, videoUrl, fileUrl, order } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Ensure only the teacher can update
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the lesson inside the course
    const lesson = course.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Update only provided fields
    if (title !== undefined) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (fileUrl !== undefined) lesson.fileUrl = fileUrl;
    if (order !== undefined) lesson.order = order;

    // ✅ Save without forcing full Course validation
    await course.save({ validateModifiedOnly: true });

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


exports.getAllCourses = async (req, res) => {
  try {
    console.log("🟢 getAllCourses function called");
    console.log("Request URL:", req.originalUrl);
    
    const courses = await Course.find().populate("teacher", "name email");
    console.log("📊 Courses found:", courses.length);
    
    if (courses.length === 0) {
      console.log("ℹ️ No courses found, returning empty array");
      return res.json([]);
    }
    
    console.log("✅ Sending courses response");
    res.json(courses);
  } catch (err) {
    console.error("❌ Error in getAllCourses:", err.message);
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};

// Get single course
exports.getCourseById = async (req, res) => {
  try {
    console.log("🟢 getCourseById function called");
    console.log("Request URL:", req.originalUrl);
    console.log("Course ID from params:", req.params.id);
    
    const { id } = req.params;
    const course = await Course.findById(id).populate("teacher", "name email");
    
    if (!course) {
      console.log("❌ Course not found with ID:", id);
      return res.status(404).json({ message: "Course not found" });
    }
    
    console.log("✅ Course found:", course.title);
    res.json(course);
  } catch (err) {
    console.error("❌ Error in getCourseById:", err.message);
    res.status(500).json({ message: "Error fetching course", error: err.message });
  }
};

// Search courses
exports.searchCourses = async (req, res) => {
  try {
    const { query, category, language, minPrice, maxPrice, sortBy } = req.query;
    let filter = {};
    
    // Text search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } }
      ];
    }
    
    // Filter by category
    if (category) filter.category = category;
    
    // Filter by language
    if (language) filter.language = language;
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Build sort object
    let sort = {};
    if (sortBy) {
      if (sortBy === 'price_asc') sort.price = 1;
      if (sortBy === 'price_desc') sort.price = -1;
      if (sortBy === 'newest') sort.createdAt = -1;
      if (sortBy === 'popular') sort.enrollmentCount = -1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }
    
    const courses = await Course.find(filter)
      .populate("teacher", "name email")
      .sort(sort);
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error searching courses", error: err.message });
  }
};