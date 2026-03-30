import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { swapId } = body;

    await dbConnect();
    
    // Mark ALL unread messages for this receiver as read
    const filter: any = { senderId: { $ne: userPayload.id }, isRead: false };
    if (swapId) {
        filter.swapId = swapId;
    }

    await Message.updateMany(filter, { $set: { isRead: true } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
