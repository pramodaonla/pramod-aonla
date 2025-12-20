import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const emailLower = email.toLowerCase();

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await Otp.deleteMany({ email: emailLower });

    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.create({
      name,
      email: emailLower,
      password,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log("OTP:", otp);

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const emailLower = email.toLowerCase();

    const record = await Otp.findOne({ email: emailLower, otp });
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(record.password, 10);

    await User.create({
      name: record.name,
      email: emailLower,
      password: hashedPassword,
      verified: true
    });

    await Otp.deleteMany({ email: emailLower });

    res.status(201).json({ message: "Account verified successfully" });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
