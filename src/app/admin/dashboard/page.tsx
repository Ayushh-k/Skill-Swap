"use client";

import { useState, useEffect, useCallback } from "react";
import AdminKPICard from "@/components/admin/AdminKPICard";
import AdminAnalyticsChart from "@/components/admin/AdminAnalyticsChart";
import DynamicButton from "@/components/admin/DynamicButton";
import { Users, ArrowLeftRight, Zap, Target, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useSocket } from "@/components/providers/SocketProvider";

interface DashboardStats {
  metrics: {
    totalUsers: number;
    totalSwaps: number;
    activeUsers: number;
    completionRate: string;
  };
  chartData: any[];
  insights: {
    topSkill: string;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        toast.error("Failed to load platform statistics");
      }
    } catch (error) {
      toast.error("Network error fetching stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("join_admin");
      socket.on("refresh_data", (data: { type: string }) => {
        if (data.type === "all" || data.type === "users" || data.type === "swaps") {
          fetchStats();
        }
      });
      return () => {
        socket.off("refresh_data");
      };
    }
  }, [socket, fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center gap-4 bg-admin-surface/30 border border-white/5 rounded-3xl">
        <Loader2 className="w-10 h-10 text-admin-emerald animate-spin" />
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Calibrating Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminKPICard 
          title="Total Users" 
          value={stats?.metrics.totalUsers || 0} 
          change="+8%" 
          trend="up" 
          icon={Users} 
          color="emerald"
          delay={0.1}
        />
        <AdminKPICard 
          title="Skill Swaps" 
          value={stats?.metrics.totalSwaps || 0} 
          change="+15%" 
          trend="up" 
          icon={ArrowLeftRight} 
          color="blue"
          delay={0.2}
        />
        <AdminKPICard 
          title="Active Members" 
          value={stats?.metrics.activeUsers || 0} 
          change="~" 
          trend="neutral" 
          icon={Zap} 
          color="rose"
          delay={0.3}
        />
        <AdminKPICard 
          title="Success Rate" 
          value={stats?.metrics.completionRate || "0%"} 
          change="+1.2%" 
          trend="up" 
          icon={Target} 
          color="zinc"
          delay={0.4}
        />
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <AdminAnalyticsChart data={stats?.chartData || []} />
        </div>
        
        {/* Quick Insights */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.5 }}
           className="p-8 rounded-2xl bg-admin-surface border border-white/10 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white tracking-tight">Smart Insights</h3>
            <div className="h-2 w-2 rounded-full bg-admin-blue animate-pulse" />
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-admin-blue/10 flex items-center justify-center shrink-0 border border-admin-blue/20">
                <Target className="w-5 h-5 text-admin-blue" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Trending: {stats?.insights.topSkill}</p>
                <p className="text-xs text-foreground/40 mt-1 leading-relaxed">
                  Platform-wide demand for <span className="text-admin-blue font-bold">{stats?.insights.topSkill}</span> is currently at its highest point this month.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-admin-emerald/10 flex items-center justify-center shrink-0 border border-admin-emerald/20">
                <Zap className="w-5 h-5 text-admin-emerald" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Engagement High</p>
                <p className="text-xs text-foreground/40 mt-1 leading-relaxed">
                  We've noticed a <span className="text-admin-emerald font-bold">24% surge</span> in swap requests during weekend evening hours.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[11px] text-foreground/60 leading-relaxed italic font-medium">
                "System Note: Platform conversion rate is currently stable. Maintain current server capacity."
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <DynamicButton
              label="Refresh Intel"
              topDrawerText="↻ Sync Data"
              bottomDrawerText="Live Stats"
              onClick={fetchStats}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
