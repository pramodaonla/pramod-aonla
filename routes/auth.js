const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      email,
      password: hash,
      verifyToken,
      verifyTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
    });

    const link = `${process.env.BACKEND_URL}/api/auth/verify/${verifyToken}`;

    await sendMail(
      email,
      "Verify your account",
      `<h3>Verify Account</h3><a href="${link}">Click here</a>`
    );

    res.json({ success: true, message: "Verification email sent" });

  } catch (e) {
    res.status(500).json({ error: "Register failed" });
  }
});

/* ================= VERIFY ================= */
router.get("/verify/:token", async (req, res) => {
  const user = await User.findOne({
    verifyToken: req.params.token,
    verifyTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).send("Invalid or expired link");

  user.verified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save();

  res.send("Email verified successfully");
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.verified) {
    return res.status(401).json({ error: "Please verify email first" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ success: true, token });
});

/* ================= FORGOT ================= */
router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ success: true });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const link = `${process.env.BACKEND_URL}/reset-password/${token}`;

  await sendMail(
    user.email,
    "Reset Password",
    `<a href="${link}">Reset Password</a>`
  );

  res.json({ success: true });
});

/* ================= RESET ================= */
router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ error: "Invalid link" });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ success: true });
});

module.exports = router;
