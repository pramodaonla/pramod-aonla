const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  await User.create({
    email,
    password: hash,
    verifyToken
  });

  const link = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;

  await sendMail(email, "Verify Email", link);

  res.json({ success: true, message: "Verification email sent" });
});

/* VERIFY EMAIL */
router.get("/verify/:token", async (req, res) => {
  const user = await User.findOne({ verifyToken: req.params.token });
  if (!user) return res.status(400).json({ error: "Invalid token" });

  user.isVerified = true;
  user.verifyToken = null;
  await user.save();

  res.json({ success: true, message: "Email verified" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.isVerified) {
    return res.status(401).json({ error: "Verify email first" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ success: true, token });
});

/* FORGOT PASSWORD */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  await user.save();

  const link = `${process.env.BASE_URL}/api/auth/reset/${resetToken}`;
  await sendMail(email, "Reset Password", link);

  res.json({ success: true });
});

/* RESET PASSWORD */
router.post("/reset/:token", async (req, res) => {
  const { password } = req.body;

  const user = await User.findOne({ resetToken: req.params.token });
  if (!user) return res.status(400).json({ error: "Invalid token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null;
  await user.save();

  res.json({ success: true, message: "Password reset" });
});

module.exports = router;
