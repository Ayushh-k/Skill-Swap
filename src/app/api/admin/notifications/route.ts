import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { AdminNotification } from "@/models/AdminNotification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const notifications = await AdminNotification.find({})
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, all } = await request.json();
    await dbConnect();

    if (all) {
      await AdminNotification.updateMany({ isRead: false }, { isRead: true });
      return NextResponse.json({ message: "All notifications marked as read" });
    }

    const notification = await AdminNotification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
