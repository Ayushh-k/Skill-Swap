import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Swap } from "@/models/Swap";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Swaps where user is requester or receiver
    const swaps = await Swap.find({
      $or: [{ requester: userPayload.id }, { receiver: userPayload.id }],
    })
      .populate("requester", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(swaps);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { receiverId, offeredSkill, requestedSkill, message } = body;

    if (!receiverId || !offeredSkill || !requestedSkill) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (receiverId === userPayload.id) {
      return NextResponse.json({ message: "Cannot swap with yourself" }, { status: 400 });
    }

    await dbConnect();

    const swap = await Swap.create({
      requester: userPayload.id,
      receiver: receiverId,
      offeredSkill,
      requestedSkill,
      message,
      status: "pending",
    });

    return NextResponse.json(swap, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
