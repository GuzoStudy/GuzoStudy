const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const courseCtrl = require("../controllers/course.controller");

// Public routes - SPECIFIC ROUTES FIRST
router.get("/search", courseCtrl.searchCourses);
router.get("/teacher/my-courses", auth, role(["teacher"]), courseCtrl.getTeacherCourses);

// Public routes - GENERAL ROUTES LAST
router.get("/", courseCtrl.getAllCourses);
router.get("/:id", courseCtrl.getCourseById);

// Teacher only routes
router.post("/", auth, role(["teacher"]), courseCtrl.createCourse);
router.post("/:id/lessons", auth, role(["teacher"]), courseCtrl.createLesson); 
router.put("/:id", auth, role(["teacher"]), courseCtrl.updateCourse);
router.delete("/:id", auth, role(["teacher"]), courseCtrl.deleteCourse);
router.put("/:id/lessons/:lessonId", auth, role(["teacher"]), courseCtrl.updateLesson);
router.delete("/:id/lessons/:lessonId", auth, role(["teacher"]), courseCtrl.deleteLesson);

module.exports = router;