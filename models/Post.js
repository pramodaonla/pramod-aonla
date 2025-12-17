const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    kind: {
      type: String, // story | photo
      default: "photo"
    },
    is_video: {
      type: Boolean,
      default: false
    },
    media: {
      type: String, // base64 or url
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
