import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Swap } from "@/models/Swap";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = await getUserFromToken();
    if (!userPayload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const swap = await Swap.findById(id).populate("requester receiver", "name email avatar bio skillsOffered skillsWanted");
    
    if (!swap) return NextResponse.json({ message: "Swap not found" }, { status: 404 });
    return NextResponse.json(swap);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = await getUserFromToken();
    if (!userPayload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    if (!["accepted", "rejected", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await dbConnect();

    const swap = await Swap.findById(id);
    if (!swap) {
      return NextResponse.json({ message: "Swap not found" }, { status: 404 });
    }

    // Only receiver can accept/reject
    if (["accepted", "rejected"].includes(status) && swap.receiver.toString() !== userPayload.id) {
      return NextResponse.json({ message: "Unauthorized to update this swap" }, { status: 403 });
    }

    swap.status = status as any;
    await swap.save();

    return NextResponse.json(swap);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
