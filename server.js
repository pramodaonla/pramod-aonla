import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo Error:", err));

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
