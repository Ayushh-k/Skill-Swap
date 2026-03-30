import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const swapId = searchParams.get("swapId");
    
    if (!swapId) return NextResponse.json({ message: "Swap ID required" }, { status: 400 });

    await dbConnect();
    const messages = await Message.find({ swapId }).sort({ createdAt: 1 }).populate("replyTo", "text senderId isDeleted");

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { swapId, text, type = "text", fileUrl, replyTo } = body;

    if (!swapId || !text) return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

    await dbConnect();
    const newMessage = await Message.create({
      swapId,
      senderId: userPayload.id,
      text,
      type,
      fileUrl,
      replyTo
    });
    await newMessage.populate("replyTo", "text senderId isDeleted");

    return NextResponse.json(newMessage);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
