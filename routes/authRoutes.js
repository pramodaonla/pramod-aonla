import express from "express";
import { registerUser, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyOtp);

export default router;
