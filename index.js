const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   MongoDB Connection
   ============================== */

const MONGO_URL = process.env.MONGO_URL; 
// Render / local env variable में डालना होगा

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo error:", err));

/* ==============================
   Schema & Model
   ============================== */

const PostSchema = new mongoose.Schema({
  msg: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", PostSchema);

/* ==============================
   Routes
   ============================== */

// health check
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// save message
app.post("/save", async (req, res) => {
  try {
    const { msg } = req.body;
    if (!msg) {
      return res.status(400).json({ ok: false, error: "msg required" });
    }

    const post = await Post.create({ msg });
    res.json({ ok: true, saved: post });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// get all messages
app.get("/list", async (req, res) => {
  const data = await Post.find().sort({ createdAt: -1 });
  res.json(data);
});

/* ==============================
   Server
   ============================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
