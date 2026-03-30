import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-in-prod";

export async function POST(req: Request) {
  try {
    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { message: "Please provide all required fields including verification code." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired verification code." }, { status: 400 });
    }

    // 2. Delete OTP after successful check
    await OTP.deleteOne({ _id: otpRecord._id });

    // 3. Check for existing user (redundancy)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await new SignJWT({ id: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(JWT_SECRET));

    const response = NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
