"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="admin-theme h-screen flex text-foreground selection:bg-admin-emerald/30 bg-background relative overflow-hidden">
      {/* Mobile Drawer (Portal-like Top Level) */}
      <AdminSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Persistent Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0 z-20">
        <AdminSidebar />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminTopbar onMenuClick={() => setMobileMenuOpen(prev => !prev)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar relative pt-6">
          {/* Subtle background glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-admin-emerald/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-admin-blue/5 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
