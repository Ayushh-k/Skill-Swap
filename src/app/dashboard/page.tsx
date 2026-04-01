"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSocket } from "@/components/providers/SocketProvider";
import { useSession } from "next-auth/react";

type SwapType = {
  _id: string;
  requester: { _id: string; name: string; email: string };
  receiver: { _id: string; name: string; email: string };
  offeredSkill: string;
  requestedSkill: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  message: string;
  createdAt: string;
};

export default function Dashboard() {
  const [swaps, setSwaps] = useState<SwapType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  const { socket } = useSocket();

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/users/me");
        if(res.ok) {
           const data = await res.json();
           setCurrentUserId(data.id);
        }
      } catch (e) {}
    }
    fetchMe();
    fetchSwaps();

    if (socket) {
      socket.on("notif_new_swap", () => {
        fetchSwaps(); // Refresh list when a new request arrives
      });
    }

    return () => {
      if (socket) socket.off("notif_new_swap");
    };
  }, [socket]);

  async function fetchSwaps() {
    try {
      const res = await fetch("/api/swaps");
      if (!res.ok) throw new Error("Failed to fetch swaps");
      const data = await res.json();
      setSwaps(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusUpdate = async (swapId: string, status: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update swap");
      
      // Emit socket event to notify the requester
      if (socket) {
        const swap = swaps.find(s => s._id === swapId);
        if (swap) {
          socket.emit("swap_status_updated", {
            swapId,
            status,
            requesterId: swap.requester._id,
            receiverName: swap.receiver.name,
          });
        }
      }

      toast.success(`Swap ${status} successfully!`);
      // Update local state without full refetch
      setSwaps(prev => prev.map(s => s._id === swapId ? { ...s, status: status as any } : s));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="absolute top-[20%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-accent-indigo/10 blur-[150px] -z-10 pointer-events-none" />

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight text-center sm:text-left">Your Dashboard</h1>

      {/* Admin Panel access button */}
      {isAdmin && (
        <Link href="/admin/dashboard" className="inline-flex mb-6">
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold text-sm hover:bg-amber-500/20 hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            🛡️ Admin Panel
          </span>
        </Link>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent-indigo" />
        </div>
      ) : swaps.length === 0 ? (
        <EmptyState 
          icon={Inbox}
          title="No Active Swaps"
          description="You haven't sent or received any skill swap requests yet. Visit the Explore page to find your first match!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {swaps.map((swap) => {
            const isRequester = swap.requester?._id === currentUserId;
            const otherPerson = isRequester ? swap.receiver : swap.requester;
            
            return (
              <Card key={swap._id} className="p-5 flex flex-col bg-surface/40 border-white/5 hover:border-accent-indigo/30 transition-all group overflow-hidden relative">
                {/* Status Badge */}
                <div className={cn(
                  "absolute top-0 right-0 px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-bl-lg border-l border-b border-white/10",
                  swap.status === "pending" ? "bg-amber-500/10 text-amber-500" : 
                  swap.status === "accepted" ? "bg-accent-teal/10 text-accent-teal" : 
                  "bg-red-500/10 text-red-500"
                )}>
                  {swap.status}
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent-indigo to-accent-teal flex items-center justify-center text-white font-bold text-xl border border-white/10 shrink-0">
                    {otherPerson?.name ? otherPerson.name[0] : "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-foreground/50 uppercase font-semibold tracking-wider truncate">
                      {isRequester ? "You requested to swap with" : "Received request from"}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate">{otherPerson?.name || "Unknown"}</h3>
                  </div>
                </div>

                <div className="bg-surface/40 rounded-lg p-4 mb-4 border border-white/5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-foreground/50 uppercase font-semibold mb-1">They Teach</p>
                      <p className="text-sm font-medium text-accent-teal">{swap.requestedSkill}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 uppercase font-semibold mb-1">They Learn</p>
                      <p className="text-sm font-medium text-accent-indigo">{swap.offeredSkill}</p>
                    </div>
                  </div>
                  {swap.message && (
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-xs text-foreground/50 uppercase font-semibold mb-1">Message</p>
                      <p className="text-sm italic text-foreground/80">"{swap.message}"</p>
                    </div>
                  )}
                </div>

                {/* Actions for receiver of a pending swap */}
                {!isRequester && swap.status === "pending" && (
                  <div className="flex gap-3 mt-auto pt-2">
                     <Button 
                      onClick={() => handleStatusUpdate(swap._id, "accepted")}
                      className="flex-1 bg-accent-teal hover:bg-accent-teal/90 text-background font-bold h-10 border-0 shadow-lg shadow-accent-teal/20"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Accept
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusUpdate(swap._id, "rejected")}
                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 h-10"
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}

                {/* Info for accepted swaps */}
                {swap.status === "accepted" && (
                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-sm text-center">
                      <p className="font-semibold mb-1">Swap Accepted!</p>
                      <p className="text-xs text-accent-teal/80">Connect in the real-time chat room below.</p>
                    </div>
                    <Link href={`/swap/${swap._id}`} className="w-full">
                      <Button className="w-full bg-gradient-to-r from-accent-indigo to-accent-teal hover:opacity-90 text-white font-bold h-11 border-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all">
                        Enter Chat Room
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
