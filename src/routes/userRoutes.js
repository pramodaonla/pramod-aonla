import express from "express";
const router = express.Router();

/* ✅ TEST */
router.get("/test", (req, res) => {
  res.json({ message: "User routes working ✅" });
});

/* ✅ PROFILE */
router.get("/profile", (req, res) => {
  res.json({
    name: "Pramod Kumar",
    status: "Profile working ✅",
  });
});

export default router;
