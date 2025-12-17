const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ✅ SAVE POST
router.post("/save", async (req, res) => {
  try {
    const { email, kind, is_video, media } = req.body;

    if (!email || !media) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const post = await Post.create({
      email,
      kind,
      is_video,
      media
    });

    res.json({ success: true, post });
  } catch (err) {
    console.error("save post error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET FEED
router.post("/feed", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ created_at: -1 })
      .limit(50);

    res.json({ posts });
  } catch (err) {
    console.error("feed error", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
