import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB
    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, returnDocument: "after" }
    );

    // Send Email
    await sendOTP(email, otpCode);

    return NextResponse.json({ message: "Verification code sent to your email" });
  } catch (error: any) {
    console.error("OTP Error:", error);
    return NextResponse.json({ message: "Failed to send verification code" }, { status: 500 });
  }
}
