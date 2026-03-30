import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(userPayload.id).select("-password");
    
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const { skillsOffered, skillsWanted, bio, name, avatar } = body;
    
    await dbConnect();
    const user = await User.findById(userPayload.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
    if (skillsOffered) user.skillsOffered = skillsOffered;
    if (skillsWanted) user.skillsWanted = skillsWanted;
    if (bio !== undefined) user.bio = bio;
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    
    await user.save();
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
