require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* RATE LIMIT */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" }
});

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

/* DB CONNECT */
mongoose
  .connect(process.env.MONGO_URI, { dbName: "pramodaonla" })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo Error:", err));

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => res.send("Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
