"use client";

import { usePathname } from "next/navigation";
import { User, Bell } from "lucide-react";
import AdminNotificationDropdown from "./AdminNotificationDropdown";

export default function AdminTopbar() {
  const pathname = usePathname();
  
  // Clean up path for title (e.g., /admin/dashboard -> Dashboard)
  const pageTitle = (pathname ?? "")
    .split("/")
    .pop()
    ?.replace(/^\w/, (c) => c.toUpperCase()) || "Dashboard";

  return (
    <header className="h-16 bg-admin-surface/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="font-heading text-xl font-bold text-white tracking-tight">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-6">
        <AdminNotificationDropdown />

        {/* User Info */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">Admin User</p>
            <p className="text-[11px] text-foreground/40 font-medium tracking-wider uppercase">Super Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-admin-emerald to-admin-blue flex items-center justify-center border border-white/10 text-black font-bold">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
