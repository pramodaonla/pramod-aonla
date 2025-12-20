import Otp from "../models/Otp.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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

    // 2️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3️⃣ Remove old OTPs
    await Otp.deleteMany({ email: emailLower });

    // 4️⃣ Save OTP
    await Otp.create({
      email: emailLower,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min
    });

    // 5️⃣ Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: emailLower,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`
    });

    return res.json({
      message: "OTP sent to email"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};
