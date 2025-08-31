const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const enrollmentCtrl = require("../controllers/enrollment.controller");

// Student only
router.post("/:id/enroll", requireAuth, requireRole(["student"]), enrollmentCtrl.enrollCourse);
router.post("/:id/lessons/:lessonId/complete", requireAuth, requireRole(["student"]), enrollmentCtrl.completeLesson);
router.get("/:id/progress", requireAuth, requireRole(["student"]), enrollmentCtrl.getProgress);
router.get("/student/my-courses", requireAuth, requireRole(["student"]), enrollmentCtrl.getStudentCourses);

module.exports = router;
