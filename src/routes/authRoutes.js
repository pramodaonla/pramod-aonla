import express from "express";
import { loginUser, registerUser } from "../../controllers/authController.js";

const router = express.Router();

/* TEST */
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

/* AUTH */
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
