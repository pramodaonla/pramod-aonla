const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");   // ✅ bcrypt import
const User = require("./models/User");

const app = express();
app.use(express.json());

// 🔗 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("Backend + Database Working");
});

// ✅ REGISTER ROUTE (password encrypted)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // email already exists check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // 🔐 password encrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ MESSAGE TEST ROUTE
app.post("/message", (req, res) => {
  const { message } = req.body;
  res.json({
    reply: "Message received",
    yourMessage: message,
  });
});

// 🚀 Server start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
