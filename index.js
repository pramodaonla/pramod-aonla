const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ✅ User model import
const User = require("./models/User");

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend + Database Working");
});

// ✅ Register user route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({
      message: "User saved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Server start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
