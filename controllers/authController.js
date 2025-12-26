import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOtp from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already verified" });

  // old OTP cleanup
  await Otp.deleteMany({ email });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 11 * 60 * 1000);

  await Otp.create({
    email,
    otp,
    purpose: "register",
    expiresAt,
  });

  await sendEmail(
    email,
    "Verify your BiggEyes account",
    otpEmailTemplate({ otp, purpose: "register" })
  );

  res.json({ message: "OTP sent to email ✅" });
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  const { name, email, password, otp } = req.body;

  const record = await Otp.findOne({ email, otp, purpose: "register" });
  if (!record)
    return res.status(400).json({ message: "Invalid OTP" });

  if (record.expiresAt < new Date())
    return res.status(400).json({ message: "OTP expired" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true,
  });

  await Otp.deleteMany({ email });

  res.json({ message: "Account verified successfully ✅" });
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (!user.isVerified)
    return res.status(401).json({ message: "Email not verified" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ message: "Login successful ✅", token });
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  await Otp.deleteMany({ email });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 11 * 60 * 1000);

  await Otp.create({
    email,
    otp,
    purpose: "forgot",
    expiresAt,
  });

  await sendEmail(
    email,
    "Reset your BiggEyes password",
    otpEmailTemplate({ otp, purpose: "forgot" })
  );

  res.json({ message: "OTP sent for password reset ✅" });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = await Otp.findOne({ email, otp, purpose: "forgot" });
  if (!record)
    return res.status(400).json({ message: "Invalid OTP" });

  if (record.expiresAt < new Date())
    return res.status(400).json({ message: "OTP expired" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  await Otp.deleteMany({ email });

  res.json({ message: "Password reset successful ✅" });
};
