import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  purpose: { 
    type: String, 
    enum: ["register", "forgot"], 
    required: true 
  },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Otp", otpSchema);
