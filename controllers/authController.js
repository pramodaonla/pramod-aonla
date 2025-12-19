const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 12);
  const otp = generateOtp();

  const user = await User.create({
    email,
    password: hashed,
    otp,
    otpExpiry: Date.now() + 5 * 60 * 1000
  });

  await sendEmail(email, "Verify OTP", `Your OTP is ${otp}`);

  res.status(201).json({ message: "OTP sent to email" });
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (
    user.otp !== otp ||
    user.otpExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: "Account verified successfully" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Verify OTP first" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent to email" });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (
    !user ||
    user.otp !== otp ||
    user.otpExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};
