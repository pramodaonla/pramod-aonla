const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    caption: {
      type: String,
      trim: true
    },

    mediaUrl: {
      type: String,
      required: true
    },

    mediaType: {
      type: String,
      enum: ["photo", "video", "story"],
      default: "photo"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
