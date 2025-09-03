const User = require("../models/user.model");

// Promote user to teacher or admin
exports.promoteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for promotion" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({
      message: `User promoted to ${role}`,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Demote user to student or teacher
exports.demoteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for demotion" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent removing the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount === 1 && role !== "admin") {
        return res.status(400).json({ message: "Cannot demote the last admin" });
      }
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User demoted to ${role}`,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users (for admin dashboard)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password hash
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
