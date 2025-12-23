const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getMyPosts
} = require("../controllers/postController");

const router = express.Router();

/* 🔒 PROTECTED ROUTES */
router.post("/create", authMiddleware, createPost);
router.get("/my", authMiddleware, getMyPosts);

module.exports = router;
