import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    /* ================= PROFILE ================= */
    username: {
      type: String,
      unique: true,
      sparse: true,      // null allowed but unique
      lowercase: true,
      trim: true
    },

    bio: {
      type: String,
      maxlength: 200
    },

    avatar: {
      type: String        // image URL
    },

    /* ================= STATUS ================= */
    verified: {
      type: Boolean,
      default: false
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    /* ================= META ================= */
    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
