const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("./models/User");

const app = express();
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// TEST
app.get("/", (req, res) => {
  res.send("Backend + Database Working");
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MESSAGE
app.post("/message", (req, res) => {
  const { message } = req.body;
  res.json({ reply: "Message received", yourMessage: message });
});

// FORGOT PASSWORD (TOKEN GENERATE)
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    res.json({
      message: "Reset token generated",
      token, // ⚠️ email नहीं, direct token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESET PASSWORD
app.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
