import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Swap } from "@/models/Swap";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const swaps = await Swap.find({})
      .populate("requester", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 })
      .limit(200);

    const formatted = swaps.map((s: any) => ({
      id: s._id.toString(),
      requester: s.requester?.name || "Deleted User",
      receiver: s.receiver?.name || "Deleted User",
      offeredSkill: s.offeredSkill || "—",
      requestedSkill: s.requestedSkill || "—",
      status: s.status,
      createdAt: s.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
