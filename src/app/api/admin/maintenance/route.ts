import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Settings } from "@/models/Settings";

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json({ maintenanceMode: settings.maintenanceMode });
  } catch (error) {
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}
