import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP expires in 10 minutes (600 seconds)
  },
});

export const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
