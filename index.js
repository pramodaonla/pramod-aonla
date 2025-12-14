const express = require("express");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend + MongoDB Working");
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// server start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
