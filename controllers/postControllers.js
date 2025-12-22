const Post = require("../models/Post");

/* ================= CREATE POST ================= */
exports.createPost = async (req, res) => {
  try {
    const { caption, mediaUrl, mediaType } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({ message: "Media URL is required" });
    }

    const post = await Post.create({
      owner: req.user._id, // 🔥 JWT se user
      caption,
      mediaUrl,
      mediaType: mediaType || "photo"
    });

    return res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= MY POSTS ================= */
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({
      message: "My posts fetched",
      posts
    });

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
