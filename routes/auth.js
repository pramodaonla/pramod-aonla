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
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashed,
      verifyToken,
      verifyTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
    });

    const link = `${process.env.BASE_URL}/api/auth/verify-email/${verifyToken}`;

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: `<p>Click to verify:</p><a href="${link}">${link}</a>`
    });

    res.json({ success: true, message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= VERIFY EMAIL ================= */
router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verifyToken: req.params.token,
      verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "Please verify email first" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const link = `${process.env.BASE_URL}/api/auth/reset-password/${token}`;

    await sendMail({
      to: email,
      subject: "Reset Password",
      html: `<p>Reset your password:</p><a href="${link}">${link}</a>`
    });

    res.json({ success: true, message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= RESEND VERIFY ================= */
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isVerified) {
      return res.json({ message: "Already verified" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verifyToken = token;
    user.verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const link = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: `<a href="${link}">${link}</a>`
    });

    res.json({ success: true, message: "Verification email resent" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
