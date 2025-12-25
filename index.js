import express from "express";
import dotenv from "dotenv";
import cors from "cors";

/* ROUTES */
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROOT CHECK */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* API ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/* PORT */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
