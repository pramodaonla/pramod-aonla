import express from "express";
import {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
