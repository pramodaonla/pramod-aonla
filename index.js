import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* DATABASE */
connectDB();

/* ROOT */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/* PORT */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
