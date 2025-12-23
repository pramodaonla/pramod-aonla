const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getMyPosts
} = require("../controllers/postController");

const router = express.Router();

/* 🔍 TEST ROUTE (NO AUTH) */
router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "Posts route working" });
});

/* 🔒 PROTECTED ROUTES */
router.post("/create", authMiddleware, createPost);
router.get("/my", authMiddleware, getMyPosts);

module.exports = router;
