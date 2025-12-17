require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Mongo connect
mongoose.connect(process.env.MONGO_URI, {DBname: "pramodaonla"})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error", err));

// ✅ AUTH ROUTES (THIS IS THE KEY)
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
