const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const enrollmentCtrl = require("../controllers/enrollment.controller");

// Student only
router.post("/:id/enroll", auth, role(["student"]), enrollmentCtrl.enrollCourse);
router.post("/:id/lessons/:lessonId/complete", auth, role(["student"]), enrollmentCtrl.completeLesson);
router.get("/:id/progress", auth, role(["student"]), enrollmentCtrl.getProgress);
router.get("/student/my-courses", auth, role(["student"]), enrollmentCtrl.getStudentCourses); // Add this route

module.exports = router;