const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend + Database Working");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
