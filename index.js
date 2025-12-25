import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

/* Root test */
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/* User routes */
app.use("/api/users", userRoutes);

/* PORT */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
