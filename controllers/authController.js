import Otp from "../models/Otp.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER: GENERATE OTP ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailLower = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // delete old OTPs
    await Otp.deleteMany({ email: emailLower });

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      email: emailLower,
      otp: String(otpCode),
      expiresAt
    });

    // TEMP: OTP in logs
    console.log(`OTP for ${emailLower}: ${otpCode}`);

    return res.status(200).json({ message: "OTP sent" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailLower = email.toLowerCase();

    const record = await Otp.findOne({
      email: emailLower,
      otp: String(otp)
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "OTP expired" });
    }

    const alreadyUser = await User.findOne({ email: emailLower });
    if (alreadyUser) {
      await Otp.deleteMany({ email: emailLower });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      verified: true
    });

    await Otp.deleteMany({ email: emailLower });

    return res.status(201).json({
      message: "Account verified successfully"
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });

    console.log("LOGIN EMAIL:", emailLower);
    console.log("USER FROM DB:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
