import express from "express";
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "User routes working ✅" });
});

router.get("/profile", (req, res) => {
  res.json({ user: "Pramod Kumar" });
});

export default router;
