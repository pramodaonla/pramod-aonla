const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

/* SAVE POST */
router.post("/save", auth, async (req, res) => {
  try {
    const { kind, is_video, media, created_at } = req.body;

    const post = await Post.create({
      email: req.user.email,
      kind,
      is_video,
      media,
      created_at
    });

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: "Post save failed" });
  }
});

/* FEED */
router.post("/feed", auth, async (req, res) => {
  try {
    const posts = await Post.find({ email: req.user.email })
      .sort({ created_at: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ error: "Feed load failed" });
  }
});

module.exports = router;
