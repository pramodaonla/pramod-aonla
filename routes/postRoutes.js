import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createPost, getMyPosts } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/my", authMiddleware, getMyPosts);

export default router;
