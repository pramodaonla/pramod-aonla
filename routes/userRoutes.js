import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import transporter from "../config/mail.js";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hash });
  res.json({ message: "Registered" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

/* FORGOT PASSWORD */
router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "Email not found" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.resetOtp = otp;
  user.otpExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset OTP",
    html: `<h2>Your OTP is ${otp}</h2>`
  });

  res.json({ message: "OTP sent" });
});

/* VERIFY OTP */
router.post("/verify-otp", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || user.resetOtp != req.body.otp)
    return res.status(400).json({ message: "Invalid OTP" });

  res.json({ message: "OTP verified" });
});

/* RESET PASSWORD */
router.post("/reset-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  user.password = await bcrypt.hash(req.body.newPassword, 10);
  user.resetOtp = null;
  user.otpExpire = null;
  await user.save();

  res.json({ message: "Password reset successful" });
});

export default router;
