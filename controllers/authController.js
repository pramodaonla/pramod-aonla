import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    name,
    email,
    password: hash,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
  });

  await sendEmail(
    email,
    "Verify your account",
    `<h2>Your OTP is ${otp}</h2>`
  );

  res.json({ message: "OTP sent to email" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email, otp });
  if (!user || user.otpExpiry < Date.now())
    return res.status(400).json({ message: "Invalid or expired OTP" });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Account verified successfully" });
};
