const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// MODEL
const PostSchema = new mongoose.Schema({
  msg: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running on Render");
});

// SAVE MESSAGE
app.post("/save", async (req, res) => {
  const { msg } = req.body;
  if (!msg) return res.json({ ok: false });

  const post = await Post.create({ msg });
  res.json({ ok: true, saved: post });
});

// GET ALL
app.get("/list", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on", PORT));
