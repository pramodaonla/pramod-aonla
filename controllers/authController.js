import Otp from "../models/Otp.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const emailLower = email.toLowerCase();

    const record = await Otp.findOne({ email: emailLower, otp });
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

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

    res.json({ message: "Account verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
