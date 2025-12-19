import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  otpExpire: Date
});

export default mongoose.model("User", userSchema);
