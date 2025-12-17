const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ✅ SAVE POST
router.post("/save", async (req, res) => {
  try {
    const { email, kind, is_video, media } = req.body;

    if (!email || !media) {
      return res.status(400).json({ error: "email & media required" });
    }

    const post = await Post.create({
      email,
      kind: kind || "photo",
      is_video: !!is_video,
      media
    });

    res.json({ success: true, post });
  } catch (err) {
    console.error("save post error", err);
    res.status(500).json({ error: "server error" });
  }
});


// ✅ FEED API (READ POSTS)  ⭐ यही आपका STEP 2 है
router.post("/feed", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email required" });
    }

    const posts = await Post.find({ email })
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    console.error("feed error", err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
