import express from "express";
import { loginUser, registerUser } from "../../controllers/authController.js";

const router = express.Router();

/* TEST ROUTE */
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

/* REGISTER */
router.post("/register", registerUser);

/* LOGIN */
router.post("/login", loginUser);

export default router;
