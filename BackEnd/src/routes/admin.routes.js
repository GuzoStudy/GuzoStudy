const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");


router.get("/users", adminController.getAllUsers);



router.patch(
  "/promote/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.promoteUser
);


router.patch(
  "/demote/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.demoteUser
);

module.exports = router;
