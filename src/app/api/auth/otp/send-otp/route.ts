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

    console.log("DEBUG: Connecting to DB for OTP...");
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("DEBUG: User already exists:", email);
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("DEBUG: Generated OTP for", email);

    // Save to DB
    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );
    console.log("DEBUG: OTP saved to DB");

    // Send Email
    console.log("DEBUG: Sending email via transporter...");
    await sendOTP(email, otpCode);
    console.log("DEBUG: Email sent successfully");

    return NextResponse.json({ message: "Verification code sent to your email" });
  } catch (error: any) {
    console.error("OTP Error:", error);
    return NextResponse.json({ message: "Failed to send verification code" }, { status: 500 });
  }
}
