const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

/*
POST /api/posts
Create new post
*/
router.post("/", async (req, res) => {
  try {
    const { email, content, media } = req.body;

    if (!email)
      return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const post = await Post.create({
      user: user._id,
      email,
      content: content || "",
      media: media || ""
    });

    res.json({ message: "Post created", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/*
GET /api/posts
Get all posts
*/
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
