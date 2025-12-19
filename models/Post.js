const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  kind: {
    type: String,
    enum: ["story", "photo"],
    required: true
  },

  dataUrl: {
    type: String,
    required: true
  },

  isVideo: {
    type: Boolean,
    default: false
  },

  likes: {
    type: Number,
    default: 0
  },

  likedBy: [{
    type: mongoose.Schema.Types.ObjectId
  }]

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
