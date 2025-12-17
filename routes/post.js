const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

/* CREATE POST */
router.post("/", auth, async (req, res) => {
  try {
    const { media, kind } = req.body;
    if (!media) {
      return res.status(400).json({ error: "Media required" });
    }

    const post = await Post.create({
      owner: req.user._id,
      media,
      kind: kind || "photo"
    });

    res.json({ message: "Post created", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* GET FEED */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("owner", "email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
