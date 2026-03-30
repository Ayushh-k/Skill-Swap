import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { Swap } from "@/models/Swap";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userPayload = await getUserFromToken();
    if (!userPayload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: userPayload.id } }).select(
      "name email avatar skillsOffered skillsWanted bio"
    ).lean();

    // Find all swaps involving the current user
    const existingSwaps = await Swap.find({
      $or: [{ requester: userPayload.id }, { receiver: userPayload.id }]
    }).lean();

    // Map over users to attach their connection status to the current user
    const usersWithStatus = users.map(u => {
      // Check if there is an active swap with this user
      const swapWithUser = existingSwaps.find(s => 
        s.requester.toString() === u._id.toString() || 
        s.receiver.toString() === u._id.toString()
      );
      
      return {
        ...u,
        connectionStatus: swapWithUser ? swapWithUser.status : null
      };
    });

    return NextResponse.json(usersWithStatus);
  } catch (error: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
