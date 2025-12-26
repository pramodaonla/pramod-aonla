import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { swaggerDocs } from "./swagger.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

/* Swagger */
swaggerDocs(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running");
});
