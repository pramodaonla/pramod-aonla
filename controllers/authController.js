import Otp from "../models/Otp.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// 1️⃣ Register: Generate OTP
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otpCode = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await Otp.create({ email: emailLower, otp: otpCode, expiresAt });

    // 🔔 Send OTP via email (optional)
    console.log(`OTP for ${emailLower}: ${otpCode}`);

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp)
      return res.status(400).json({ message: "All fields are required" });

    const emailLower = email.toLowerCase();
    const record = await Otp.findOne({ email: emailLower, otp });

    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email: emailLower, password: hashedPassword, verified: true });
    await Otp.deleteMany({ email: emailLower });

    res.status(201).json({ message: "Account verified successfully" });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "User already exists" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
