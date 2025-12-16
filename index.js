require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔥 FIX: FORCE DATABASE NAME */
mongoose.connect(process.env.MONGO_URI, {
  dbName: "pramodaonla"
})
.then(() => {
  console.log("MongoDB connected to pramodaonla");
})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

/* ROUTES */
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

/* SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
