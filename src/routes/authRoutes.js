import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";        // ✅ FIXED
import authRoutes from "./src/routes/authRoutes.js"; // ✅ CORRECT

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
