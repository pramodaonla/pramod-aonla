import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  resetOtp: String,
  otpExpire: Date
});

export default mongoose.model("User", userSchema);
