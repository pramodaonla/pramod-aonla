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

/* ================= PUBLIC ROUTES ================= */
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* ================= PROTECTED ROUTE ================= */
/* 🔐 JWT TEST / CURRENT USER */
router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    message: "Authenticated user",
    user: req.user
  });
});

export default router;
