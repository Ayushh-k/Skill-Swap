import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { Swap } from "@/models/Swap";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    // Find all swaps this user is part of
    const swaps = await Swap.find({
      $or: [{ requester: userPayload.id }, { receiver: userPayload.id }],
      status: "accepted"
    }).select("_id");
    
    const swapIds = swaps.map(s => s._id);

    // Find unread messages where user is NOT the sender
    const unreadMessages = await Message.find({
      swapId: { $in: swapIds },
      senderId: { $ne: userPayload.id },
      isRead: false
    })
    .populate("senderId", "name avatar")
    .sort({ createdAt: -1 })
    .limit(10); // get latest 10 for notification panel

    const count = await Message.countDocuments({
      swapId: { $in: swapIds },
      senderId: { $ne: userPayload.id },
      isRead: false
    });

    return NextResponse.json({ count, messages: unreadMessages });
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
