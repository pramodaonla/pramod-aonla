const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verifyToken: String,
  verifyTokenExpiry: Date,

  resetToken: String,
  resetTokenExpiry: Date

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
