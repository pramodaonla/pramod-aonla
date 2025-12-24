const express = require("express");
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* PUBLIC ROUTES */
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* PROTECTED ROUTE */
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Authenticated user", user: req.user });
});

module.exports = router;
