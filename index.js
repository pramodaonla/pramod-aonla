require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

/* ================= RATE LIMIT ================= */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: "Too many requests, please try again later"
  }
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "pramodaonla"
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo Error:", err));

/* ================= ROUTES ================= */
/* ⚠️ file names MUST match routes folder */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/posts"));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend Running");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
