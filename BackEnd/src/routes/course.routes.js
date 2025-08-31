const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const courseCtrl = require("../controllers/course.controller");

// Public routes - SPECIFIC FIRST
router.get("/search", courseCtrl.searchCourses);

// Teacher-only (must be before "/:id")
router.get("/teacher/my-courses", requireAuth, requireRole(["teacher"]), courseCtrl.getTeacherCourses);

// Public routes - GENERAL
router.get("/", courseCtrl.getAllCourses);
router.get("/:id", courseCtrl.getCourseById);

// Teacher-only CRUD
router.post("/", requireAuth, requireRole(["teacher"]), courseCtrl.createCourse);
router.post("/:id/lessons", requireAuth, requireRole(["teacher"]), courseCtrl.createLesson);
router.put("/:id", requireAuth, requireRole(["teacher"]), courseCtrl.updateCourse);
router.delete("/:id", requireAuth, requireRole(["teacher"]), courseCtrl.deleteCourse);
router.put("/:id/lessons/:lessonId", requireAuth, requireRole(["teacher"]), courseCtrl.updateLesson);
router.delete("/:id/lessons/:lessonId", requireAuth, requireRole(["teacher"]), courseCtrl.deleteLesson);

module.exports = router;
