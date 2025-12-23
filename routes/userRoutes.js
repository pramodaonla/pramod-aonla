const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, (req, res) => {
  try {
    if (req.user.isBlocked) {
      return res.status(403).json({ message: "Account blocked" });
    }

    res.json({
      message: "Profile fetched successfully",
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.isBlocked) {
      return res.status(403).json({ message: "Account blocked" });
    }

    const { name, username, bio, avatar } = req.body;

    // ❌ security: email & password yahan change nahi honge
    const updates = {};
    if (name) updates.name = name;
    if (username) updates.username = username.toLowerCase();
    if (bio) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    const User = require("../models/User");
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already taken" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
