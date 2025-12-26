import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOtp from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    // Generate OTP
    const otpCode = generateOtp();
    const otpExpiry = new Date(Date.now() + 11 * 60 * 1000); // 11 minutes
    await Otp.create({ email, otp: otpCode, expiresAt: otpExpiry });

    // Send Email
    await sendEmail(email, "Verify your account", `<p>Your OTP is <b>${otpCode}</b></p>`);

    res.status(201).json({ message: "OTP sent to your email ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    // Mark user verified
    await User.findOneAndUpdate({ email }, { isVerified: true });
    await Otp.deleteMany({ email }); // delete used OTP

    res.json({ message: "Account verified ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(401).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123", { expiresIn: "7d" });
    res.json({ message: "Login successful ✅", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpCode = generateOtp();
    const otpExpiry = new Date(Date.now() + 11 * 60 * 1000);
    await Otp.create({ email, otp: otpCode, expiresAt: otpExpiry });

    await sendEmail(email, "Reset your password", `<p>Your OTP is <b>${otpCode}</b></p>`);
    res.json({ message: "OTP sent for password reset ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteMany({ email });

    res.json({ message: "Password reset successful ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
