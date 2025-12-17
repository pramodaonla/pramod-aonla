const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    kind: { type: String, enum: ["photo", "story"], default: "photo" },
    is_video: { type: Boolean, default: false },
    media: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
