import Otp from "../models/Otp.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const emailLower = email.toLowerCase();

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 2️⃣ Find OTP record
    const record = await Otp.findOne({ email: emailLower, otp });

    if (!record) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // 3️⃣ OTP expiry check
    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create user AFTER OTP verification
    await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      verified: true
    });

    // 6️⃣ Delete OTP after success
    await Otp.deleteMany({ email: emailLower });

    return res.status(201).json({
      message: "Account verified successfully"
    });

  } catch (err) {

    // 🔥 Duplicate email safeguard
    if (err.code === 11000) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    console.error(err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};
