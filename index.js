const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const twilio = require("twilio");
const User = require("./models/User");

const app = express();
app.use(express.json());

// 🔗 MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 🔐 Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 🧪 Test
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// 🟢 Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash });

    res.json({ message: "Registered successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 🟢 Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    res.json({ message: "Login success" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 🟡 Forgot Password → Send OTP
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: email,
        channel: "email",
      });

    res.json({ message: "OTP sent to email" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 🔴 Reset Password → Verify OTP
app.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: email,
        code: otp,
      });

    if (check.status !== "approved") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hash }
    );

    res.json({ message: "Password reset successful" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 🚀 Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
