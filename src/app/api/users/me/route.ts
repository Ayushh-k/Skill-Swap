import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const userPayload = await getUserFromToken();
  if (!userPayload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const dbUser = await User.findById(userPayload.id).select("name avatar");

  return NextResponse.json({ 
    id: userPayload.id, 
    email: userPayload.email,
    name: dbUser?.name,
    avatar: dbUser?.avatar 
  });
}
