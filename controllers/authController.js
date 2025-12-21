import Otp from "../models/Otp.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= SAFE EMAIL SENDER ================= */
const safeSendEmail = async (to, subject, html) => {
  try {
    await sendEmail(to, subject, html);
    console.log("EMAIL SENT TO:", to);
  } catch (err) {
    console.error("EMAIL FAILED (IGNORED):", err.message);
  }
};

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const emailLower = email.toLowerCase().trim();

    if (await User.findOne({ email: emailLower }))
      return res.status(400).json({ message: "User already exists" });

    await Otp.deleteMany({ email: emailLower });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({ email: emailLower, otp, expiresAt });

    console.log("REGISTER OTP:", emailLower, otp);

    // 🔥 NON-BLOCKING EMAIL
    safeSendEmail(
      emailLower,
      "Verify your account",
      `<h3>Your OTP: ${otp}</h3><p>Valid for 10 minutes</p>`
    );

    return res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp)
      return res.status(400).json({ message: "All fields are required" });

    const emailLower = email.toLowerCase().trim();

    const record = await Otp.findOne({ email: emailLower, otp: String(otp) });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: emailLower,
      password: hashed,
      verified: true
    });

    await Otp.deleteMany({ email: emailLower });

    return res.status(201).json({ message: "Account verified successfully" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.verified) return res.status(403).json({ message: "Account not verified" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    return res.json({ message: "Login successful", token, user });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(404).json({ message: "User not found" });

    await Otp.deleteMany({ email: emailLower });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({ email: emailLower, otp, expiresAt });

    console.log("FORGOT OTP:", emailLower, otp);

    safeSendEmail(
      emailLower,
      "Reset Password OTP",
      `<h3>Your OTP: ${otp}</h3><p>Valid for 10 minutes</p>`
    );

    return res.json({ message: "OTP sent for password reset" });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields required" });

    const emailLower = email.toLowerCase().trim();
    const record = await Otp.findOne({ email: emailLower, otp: String(otp) });

    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email: emailLower },
      { $set: { password: hashed } }
    );

    await Otp.deleteMany({ email: emailLower });

    return res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
