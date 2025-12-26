import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOtp from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";

/* ================= REGISTER (SEND OTP ONLY) ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email, isVerified: true });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    await Otp.deleteMany({ email }); // old OTP clean

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 11 * 60 * 1000);

    await Otp.create({
      email,
      otp,
      expiresAt,
      meta: { name, password } // temp store
    });

    await sendEmail(
      email,
      "Welcome to BiggEyes – Verify Email",
      otpEmailTemplate({ otp, purpose: "register" })
    );

    res.json({ message: "OTP sent to email ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= VERIFY OTP & CREATE USER ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const { name, password } = record.meta;
    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      isVerified: true
    });

    await Otp.deleteMany({ email });

    res.json({ message: "Account verified & created ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ message: "Login successful ✅", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    await Otp.deleteMany({ email });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 11 * 60 * 1000);

    await Otp.create({ email, otp, expiresAt });

    await sendEmail(
      email,
      "BiggEyes – Reset Password",
      otpEmailTemplate({ otp, purpose: "forgot" })
    );

    res.json({ message: "OTP sent for reset ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });

    await Otp.deleteMany({ email });

    res.json({ message: "Password reset successful ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
