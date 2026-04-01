import { usePathname } from "next/navigation";
import { User, Bell, Menu } from "lucide-react";
import AdminNotificationDropdown from "./AdminNotificationDropdown";

export default function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  
  const pageTitle = (pathname ?? "")
    .split("/")
    .pop()
    ?.replace(/^\w/, (c) => c.toUpperCase()) || "Dashboard";

  return (
    <header className="h-16 bg-admin-surface/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-[40]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight truncate max-w-[150px] sm:max-w-none">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <AdminNotificationDropdown />

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white leading-tight">Admin User</p>
            <p className="text-[10px] text-foreground/40 font-bold tracking-wider uppercase mt-0.5">Super Admin</p>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-admin-emerald to-admin-blue flex items-center justify-center border border-white/10 text-black font-extrabold text-sm sm:text-base">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
