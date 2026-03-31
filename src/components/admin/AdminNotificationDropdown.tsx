"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X, Loader2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

interface AdminNotificationType {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications cleared");
      }
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "text-foreground/60 hover:text-white transition-all relative p-2 rounded-full hover:bg-white/5",
          isOpen && "bg-white/10 text-white"
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-admin-rose rounded-full border-2 border-admin-surface animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-4 w-96 bg-admin-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-black/50 z-20"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mt-0.5">
                  {unreadCount} UNREAD ALERTS
                </p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-admin-emerald hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest"
                >
                  <Check className="w-3 h-3" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-admin-emerald animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-foreground/20" />
                  </div>
                  <p className="text-sm text-foreground/40 font-medium italic">Everything's quiet right now.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n._id}
                      className={cn(
                        "p-5 hover:bg-white/[0.03] transition-all relative group",
                        !n.isRead && "bg-admin-emerald/[0.02]"
                      )}
                    >
                      {!n.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-emerald" />
                      )}
                      
                      <div className="flex gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-1",
                          n.type === "new_user" ? "bg-admin-blue/10 text-admin-blue" :
                          n.type === "security_flag" ? "bg-admin-rose/10 text-admin-rose" :
                          "bg-admin-emerald/10 text-admin-emerald"
                        )}>
                          <Bell className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn(
                              "text-sm font-bold tracking-tight",
                              n.isRead ? "text-foreground/60" : "text-white"
                            )}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-foreground/20 font-bold whitespace-nowrap pt-0.5">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/40 mt-1 font-medium leading-relaxed">
                            {n.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            {n.link && (
                              <Link 
                                href={n.link}
                                onClick={() => { markAsRead(n._id); setIsOpen(false); }}
                                className="text-[10px] font-bold text-white hover:text-admin-emerald transition-colors uppercase tracking-widest underline decoration-white/10"
                              >
                                View Details
                              </Link>
                            )}
                            {!n.isRead && (
                              <button 
                                onClick={() => markAsRead(n._id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/5 text-foreground/20 hover:text-white transition-all ml-auto"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-white/[0.02] text-center">
                <p className="text-[10px] text-foreground/20 font-bold uppercase tracking-widest">
                  Showing last {notifications.length} alerts
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
