"use client";

import { useState, useEffect } from "react";
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
  LogOut,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview",  href: "/admin/dashboard" },
  { icon: Users,           label: "Users",     href: "/admin/users" },
  { icon: ArrowLeftRight,  label: "Swaps",     href: "/admin/swaps" },
  { icon: Settings,        label: "Settings",  href: "/admin/settings" },
];

export default function AdminSidebar({ 
  mobileOpen, 
  setMobileOpen 
}: { 
  mobileOpen?: boolean; 
  setMobileOpen?: (open: boolean) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && setMobileOpen) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobileOpen]);

  const NavLinks = () => (
    <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
              isActive
                ? "bg-admin-emerald/10 text-admin-emerald"
                : "text-foreground/60 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-admin-emerald" : "group-hover:text-white")} />
            {/* Show label always on mobile drawer, conditionally on desktop */}
            <span className={cn(
              "text-sm font-semibold transition-all duration-300",
              "lg:block", // always on desktop
              isCollapsed ? "lg:hidden" : "lg:block"
            )}>
              {item.label}
            </span>
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
  );

  // Render only one part based on the provided props to avoid duplicate IDs/logic
  if (mobileOpen !== undefined) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setMobileOpen?.(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-admin-surface border-r border-white/10 flex flex-col z-[70] shadow-2xl"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-admin-emerald flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-black" />
                  </div>
                  <span className="font-heading font-bold text-lg tracking-tight text-white">Admin Panel</span>
                </div>
                <button onClick={() => setMobileOpen?.(false)} className="text-foreground/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NavLinks />
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-admin-rose/60 hover:text-admin-rose hover:bg-admin-rose/10 transition-all group"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden lg:flex h-screen max-h-screen bg-admin-surface border-r border-white/10 flex-col relative z-20 overflow-hidden shrink-0"
    >
      <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-admin-emerald flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-heading font-bold text-base tracking-tight text-white whitespace-nowrap overflow-hidden"
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                isActive
                  ? "bg-admin-emerald/10 text-admin-emerald"
                  : "text-foreground/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-admin-emerald" : "group-hover:text-white")} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="active-tab-desktop"
                  className="absolute left-0 w-1 h-6 bg-admin-emerald rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3.5 h-7 w-7 rounded-full bg-admin-surface border border-white/10 flex items-center justify-center text-foreground hover:text-white shadow-xl hover:scale-110 active:scale-95 transition-all z-30"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          onClick={async () => {
            await signOut({ redirect: true, callbackUrl: "/login" });
          }}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-admin-rose/60 hover:text-admin-rose hover:bg-admin-rose/10 transition-all group"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-semibold whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
