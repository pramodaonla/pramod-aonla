const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= CREATE POST ================= */
router.post("/create", auth, async (req, res) => {
  const { kind, dataUrl, isVideo } = req.body;

  if (!dataUrl || !kind) {
    return res.status(400).json({ error: "Invalid post" });
  }

  const post = await Post.create({
    user: req.user._id,
    kind,
    dataUrl,
    isVideo: !!isVideo
  });

  res.json({ success: true, post });
});

/* ================= LIST FEED ================= */
router.get("/list", auth, async (req, res) => {
  const posts = await Post.find()
    .populate("user", "email")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ posts });
});

/* ================= LIKE / UNLIKE ================= */
router.post("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const uid = req.user._id.toString();

  if (post.likedBy.includes(uid)) {
    post.likedBy.pull(uid);
    post.likes--;
  } else {
    post.likedBy.push(uid);
    post.likes++;
  }

  await post.save();
  res.json({ success: true, likes: post.likes });
});

/* ================= DELETE POST ================= */
router.delete("/delete/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not allowed" });
  }

  await post.deleteOne();
  res.json({ success: true });
});

module.exports = router;
