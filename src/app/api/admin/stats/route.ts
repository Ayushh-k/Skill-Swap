import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
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

    // 1. Basic Totals
    const [totalUsers, totalSwaps, activeUsers, acceptedSwaps] = await Promise.all([
      User.countDocuments(),
      Swap.countDocuments(),
      User.countDocuments({ status: "active" }),
      Swap.countDocuments({ status: { $in: ["accepted", "completed"] } })
    ]);

    const completionRate = totalSwaps > 0 ? ((acceptedSwaps / totalSwaps) * 100).toFixed(1) : "0";

    // 2. Last 7 Days Growth Data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const chartData = await Promise.all(last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const [userCount, swapCount] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: date, $lt: nextDay } }),
        Swap.countDocuments({ createdAt: { $gte: date, $lt: nextDay } })
      ]);

      return {
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        users: userCount,
        swaps: swapCount
      };
    }));

    // 3. Simple Trend Metrics (Compared to previous period - Placeholder logic for now)
    // In a real app, you'd compare current 7 days vs previous 7 days.
    
    // 4. Insights (Aggregate Top Skills)
    const skillsAggregation = await User.aggregate([
      { $project: { allSkills: { $setUnion: ["$skillsOffered", "$skillsWanted"] } } },
      { $unwind: "$allSkills" },
      { $group: { _id: "$allSkills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const topSkill = skillsAggregation.length > 0 ? skillsAggregation[0]._id : "None";

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalSwaps,
        activeUsers,
        completionRate: `${completionRate}%`
      },
      chartData,
      insights: {
        topSkill
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
