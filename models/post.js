const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  kind: {
    type: String,
    enum: ["photo", "video", "story"],
    default: "photo"
  },
  media: {
    type: String,   // base64 (अभी)
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", PostSchema);
