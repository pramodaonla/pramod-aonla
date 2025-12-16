const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend + Database Working");
});

// ✅ REGISTER ROUTE
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.json({
      message: "User registered successfully",
      user,
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
