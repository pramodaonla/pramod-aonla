const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const User = require("./models/User");

const app = express();
app.use(express.json());

/* ===================== DB ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ===================== EMAIL ===================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===================== TEST ===================== */
app.get("/", (req, res) => {
  res.send("Backend working perfectly ✅");
});

/* ===================== REGISTER ===================== */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== LOGIN ===================== */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  res.json({ message: "Login successful" });
});

/* ===================== MESSAGE ===================== */
app.post("/message", (req, res) => {
  res.json({
    success: true,
    yourMessage: req.body,
  });
});

/* ===================== FORGOT PASSWORD ===================== */
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOTP = otp;
  user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    to: email,
    subject: "Password Reset OTP",
    html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes</p>`,
  });

  res.json({ message: "OTP sent to email" });
});

/* ===================== RESET PASSWORD ===================== */
app.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({
    email,
    resetOTP: otp,
    resetOTPExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
