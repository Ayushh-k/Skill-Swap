"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut, Bell, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const isLoading = status === "loading";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification State
  const [unread, setUnread] = useState({ count: 0, messages: [] as any[] });
  const [showNotifs, setShowNotifs] = useState(false);
  const [dismissedCount, setDismissedCount] = useState(0);
  const [dbAvatar, setDbAvatar] = useState<string | null>(null);
  const isInitialFetch = useRef(true);
  const prevShowNotifs = useRef(false);

  // Sync "Read" status when panel is CLOSED
  useEffect(() => {
    if (prevShowNotifs.current === true && showNotifs === false) {
      if (unread.messages.length > 0) {
        fetch("/api/messages/read", { method: "POST", body: JSON.stringify({}) })
          .then(() => {
            setUnread(prev => ({ count: 0, messages: prev.messages }));
            setDismissedCount(0);
            if (typeof window !== "undefined") {
              window.localStorage.setItem("skillswap_dismissed_notifs", "0");
            }
          })
          .catch(() => {});
      }
    }
    prevShowNotifs.current = showNotifs;
  }, [showNotifs, unread.messages.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCount = window.localStorage.getItem("skillswap_dismissed_notifs");
      if (savedCount) setDismissedCount(parseInt(savedCount));
    }
  }, []);

  useEffect(() => {
    if (user && !user.image) {
      // Fetch avatar from DB since we stripped the massive base64 string from the JWT session
      fetch("/api/users/me")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.avatar) setDbAvatar(data.avatar);
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Plays a pleasant double-chime using native Web Audio API
      const playNotificationSound = () => {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) return;
          const ctx = new AudioContext();
          
          const playOsci = (freq: number, startTime: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
            osc.start(startTime);
            osc.stop(startTime + 0.4);
          };
          
          playOsci(523.25, ctx.currentTime); // C5
          playOsci(659.25, ctx.currentTime + 0.15); // E5
        } catch(e) {}
      };

      // Fetch unread notifications
      const fetchUnread = () => {
        fetch("/api/messages/unread")
          .then(res => res.json())
          .then(data => {
             if (showNotifs && data.messages.length === 0 && unread.messages.length > 0) {
                // If panel is open and new poll says 0, it means they were marked as read elsewhere
                // or the poll hit right after we opened. We keep current messages to avoid "vanishing".
                return;
             }
             setUnread((prev) => {
               setDismissedCount(currentDismissed => {
                 let newDismissed = currentDismissed;
                 
                 if (!isInitialFetch.current) {
                   if (data.count > prev.count) {
                     newDismissed = 0; // New message arrived, reset badge
                     playNotificationSound();
                   } else if (data.count < prev.count) {
                     newDismissed = Math.min(newDismissed, data.count); // Messages were read
                   }
                 } else {
                   // Initial load: don't mistakenly treat difference from 0 state as new messages
                   isInitialFetch.current = false;
                   newDismissed = Math.min(currentDismissed, data.count);
                 }
                 
                 if (typeof window !== "undefined") {
                   localStorage.setItem("skillswap_dismissed_notifs", newDismissed.toString());
                 }
                 return newDismissed;
               });
               return data;
             });
          })
          .catch(() => {});
      };
      
      fetchUnread();
      // Poll every 15 seconds to keep notification bell updated pseudo-realtime globally
      const idx = setInterval(fetchUnread, 15000);
      return () => clearInterval(idx);
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const displayAvatar = user?.image || dbAvatar;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center flex-row justify-between px-4">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-white flex items-center justify-center group">
          <img src="/logo.png" alt="Skill-Swap Logo" className="h-14 sm:h-16 w-auto object-contain scale-[1.5] sm:scale-[1.8] origin-center cursor-pointer group-hover:scale-[1.7] sm:group-hover:scale-[2.0] transition-transform" />
        </Link>
        <div className="flex items-center gap-2">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/explore" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors">
              Explore
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!isLoading && (
              user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <Button variant="ghost" onClick={() => setShowNotifs(!showNotifs)} className="relative text-white hover:bg-white/10 px-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full">
                      <Bell className="w-5 h-5" />
                      {Math.max(0, unread.count - dismissedCount) > 0 && (
                         <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-md border border-background">
                           {Math.max(0, unread.count - dismissedCount) > 9 ? "9+" : Math.max(0, unread.count - dismissedCount)}
                         </span>
                      )}
                    </Button>
                    
                    {showNotifs && (
                      <div className="fixed top-20 left-4 right-4 w-auto sm:absolute sm:top-12 sm:right-0 sm:left-auto sm:w-80 bg-[#0A0A0A] border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-200" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                        <div className="p-4 border-b border-white/10">
                          <h3 className="text-sm font-bold text-white">Unread Messages</h3>
                        </div>
                        <div className="p-4 pt-2 max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col gap-3">
                        {unread.messages.length === 0 ? (
                          <p className="text-xs text-foreground/50 text-center py-4">No new notifications</p>
                        ) : (
                          unread.messages.map(msg => (
                            <Link key={msg._id} href={`/swap/${msg.swapId}`} onClick={() => setShowNotifs(false)} className="text-sm text-foreground/80 hover:bg-white/5 p-3 rounded-lg transition-colors flex flex-col gap-1 border border-white/5 bg-background/30 shadow-sm">
                               <div className="flex justify-between items-center w-full">
                                 <span className="font-semibold text-accent-indigo">{msg.senderId?.name || "Buddy"}</span>
                                 <span className="text-[10px] opacity-50">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                               </div>
                               <span className="truncate opacity-70 text-xs">{msg.text}</span>
                            </Link>
                          ))
                        )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href="/profile" className="hidden sm:block">
                     <Button variant="ghost" size="sm" className="flex gap-2 text-white hover:bg-white/10 relative overflow-hidden group">
                       {displayAvatar ? (
                          <img src={displayAvatar} alt="Avatar" className="w-5 h-5 object-cover rounded-full" />
                       ) : (
                          <User className="w-4 h-4" />
                       )}
                       Profile
                     </Button>
                  </Link>

                  <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex gap-2 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                    <LogOut className="w-4 h-4" /> 
                    <span>Logout</span>
                  </Button>

                  {/* Mobile Profile Avatar Trigger */}
                  <div className="sm:hidden flex items-center gap-2">
                    <Link href="/profile">
                      <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-accent-indigo to-accent-teal flex items-center justify-center text-white text-xs font-bold uppercase">
                        {displayAvatar ? <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.[0] || 'U'}
                      </div>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="px-2 text-white">
                      {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <div className="hidden xs:flex items-center gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="premium">Sign up</Button>
                    </Link>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xs:hidden px-2 text-white">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200 z-40">
          <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-white transition-colors py-2 border-b border-white/5">
            Explore
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-white transition-colors py-2 border-b border-white/5">
                Dashboard
              </Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-white transition-colors py-2 border-b border-white/5">
                My Profile
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                className="text-lg font-medium text-red-500 hover:text-red-400 transition-colors py-2 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="premium" className="w-full">Log in</Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="premium" className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
