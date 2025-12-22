import Otp from "../models/Otp.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= EMAIL TEMPLATE ================= */
const otpEmailTemplate = ({ otp, reason }) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:30px">
      <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px">
        <h1 style="text-align:center; color:#e91e63; margin-bottom:10px;">
          Welcome to BiggEyes
        </h1>

        <p style="font-size:14px; color:#555; text-align:center;">
          ${reason}
        </p>

        <div style="margin:30px 0; text-align:center;">
          <div style="
            font-size:32px;
            letter-spacing:6px;
            font-weight:bold;
            color:#000;
            background:#ffe6f0;
            padding:15px;
            border-radius:6px;
          ">
            ${otp}
          </div>
        </div>

        <p style="font-size:13px; color:#777; text-align:center;">
          This OTP is valid for <b>10 minutes</b> only.
        </p>

        <p style="font-size:12px; color:#999; text-align:center; margin-top:20px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    </div>
  `;
};

/* ================= SAFE EMAIL (NON-BLOCKING) ================= */
const safeSendEmail = async (to, subject, html) => {
  try {
    await sendEmail(to, subject, html);
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

    safeSendEmail(
      emailLower,
      "Verify your BiggEyes account",
      otpEmailTemplate({
        otp,
        reason: "Use the OTP below to complete your account registration."
      })
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

    if (await User.findOne({ email: emailLower })) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "User already exists" });
    }

    const record = await Otp.findOne({ email: emailLower, otp: String(otp) });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d"
    });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

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

    safeSendEmail(
      emailLower,
      "Reset your BiggEyes password",
      otpEmailTemplate({
        otp,
        reason: "Use the OTP below to reset your password."
      })
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email: emailLower },
      { $set: { password: hashedPassword } }
    );

    await Otp.deleteMany({ email: emailLower });

    return res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
