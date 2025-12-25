import express from "express";
import { registerUser, loginUser, getProfile } from "../../controllers/userController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

router.get("/test", (req, res) => res.json({ message: "User routes working ✅" }));

export default router;
