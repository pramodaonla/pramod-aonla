const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= PROTECTED PROFILE ================= */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user
  });
});

module.exports = router;
