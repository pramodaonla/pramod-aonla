require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECT
========================= */
mongoose.connect(process.env.MONGO_URI, {
  dbName: "pramodaonla"
})
.then(() => {
  console.log("MongoDB connected to pramodaonla");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});

/* =========================
   ROUTES
========================= */

// 🔐 Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// 📝 Post routes
const postRoutes = require("./routes/posts");
app.use("/api/posts", postRoutes);

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.send("Backend Running");
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
