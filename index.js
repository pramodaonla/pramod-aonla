const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// Schema
const PostSchema = new mongoose.Schema({
  msg: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running on Render 🚀");
});

// Save data
app.post("/save", async (req, res) => {
  const { msg } = req.body;
  if (!msg) return res.json({ ok: false });

  const post = await Post.create({ msg });
  res.json({ ok: true, saved: post });
});

// Get all data
app.get("/list", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
