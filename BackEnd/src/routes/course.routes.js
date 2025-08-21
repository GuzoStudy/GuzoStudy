const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const courseCtrl = require("../controllers/course.controller");

// Public
router.get("/search", courseCtrl.searchCourses);

// Teacher only
router.post("/", auth, role(["teacher"]), courseCtrl.createCourse);
router.post("/:id/lessons", auth, role(["teacher"]), courseCtrl.addLesson);

// Student
router.post("/:id/enroll", auth, role(["student"]), courseCtrl.enrollInCourse);
router.post("/:id/lessons/:lessonId/complete", auth, role(["student"]), courseCtrl.completeLesson);
router.get("/:id/progress", auth, role(["student"]), courseCtrl.getProgress);

module.exports = router;
