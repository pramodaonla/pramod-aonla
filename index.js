import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* root test */
app.get("/", (req, res) => {
  res.send("API running successfully 🚀");
});

/* routes */
app.use("/api/users", userRoutes);

/* PORT (Render compatible) */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
