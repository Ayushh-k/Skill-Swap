"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminKPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: "emerald" | "blue" | "rose" | "zinc";
  delay?: number;
}

export default function AdminKPICard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  color = "emerald",
  delay = 0
}: AdminKPICardProps) {
  const colorMap = {
    emerald: "text-admin-emerald bg-admin-emerald/10",
    blue: "text-admin-blue bg-admin-blue/10",
    rose: "text-admin-rose bg-admin-rose/10",
    zinc: "text-foreground/60 bg-white/5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-admin-surface border border-white/10 shadow-xl hover:shadow-2xl transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", colorMap[color])}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-foreground/40 uppercase tracking-wider">{title}</span>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
            {change && (
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-xs font-bold px-1.5 py-0.5 rounded",
                  trend === "up" ? "text-admin-emerald bg-admin-emerald/10" : 
                  trend === "down" ? "text-admin-rose bg-admin-rose/10" : 
                  "text-foreground/40 bg-white/5"
                )}>
                  {change}
                </span>
                <span className="text-[10px] text-foreground/30 font-medium uppercase">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
