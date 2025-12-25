import express from "express";
import { loginUser, registerUser } from "../../controllers/authController.js";

const router = express.Router();

/* TEST */
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
