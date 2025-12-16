const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtp = require("../utils/sendOtp");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    email,
    password: hashed,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000
  });

  await sendOtp(email, otp);
  res.json({ message: "OTP sent" });
});

/* VERIFY OTP */
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now())
    return res.status(400).json({ error: "Invalid OTP" });

  user.verified = true;
  user.otp = null;
  await user.save();

  res.json({ message: "Account verified" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.verified)
    return res.status(400).json({ error: "User not verified" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, email: user.email });
});

/* FORGOT PASSWORD */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.findOneAndUpdate(
    { email },
    { otp, otpExpiry: Date.now() + 10 * 60 * 1000 }
  );

  if (!user) return res.status(404).json({ error: "User not found" });

  await sendOtp(email, otp);
  res.json({ message: "OTP sent" });
});

/* RESET PASSWORD */
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < Date.now())
    return res.status(400).json({ error: "Invalid OTP" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  await user.save();

  res.json({ message: "Password reset successful" });
});

module.exports = router;
