"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: ArrowLeftRight, label: "Swaps", href: "/admin/swaps" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen max-h-screen bg-admin-surface border-r border-white/10 flex flex-col relative z-20 overflow-hidden"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-admin-emerald flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          {!isCollapsed && (
            <span className="font-heading font-bold text-lg tracking-tight text-white animate-in fade-in duration-300">
              Admin Panel
            </span>
          )}
        </div>
      </div>

      {/* Navigation — scrolls internally if there are many items */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative",
                isActive 
                  ? "bg-admin-emerald/10 text-admin-emerald" 
                  : "text-foreground/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-admin-emerald" : "group-hover:text-white")} />
              {!isCollapsed && (
                <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute left-0 w-1 h-6 bg-admin-emerald rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-4 h-8 w-8 rounded-full bg-admin-surface border border-white/10 flex items-center justify-center text-foreground hover:text-white shadow-xl hover:scale-110 active:scale-95 transition-all z-30"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-admin-rose/60 hover:text-admin-rose hover:bg-admin-rose/10 transition-all group">
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium animate-in fade-in duration-300">Logout</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
