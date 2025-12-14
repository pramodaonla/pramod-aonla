const express = require("express");
const app = express();

app.use(express.json()); // JSON body read karne ke liye

app.get("/", (req, res) => {
  res.send("Backend working");
});

// 👇 MESSAGE TEST API
app.post("/message", (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    received: message
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server started on", PORT);
});
