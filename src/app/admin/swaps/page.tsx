"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { ArrowLeftRight, Calendar, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SwapRecord {
  id: string;
  requester: string;
  receiver: string;
  offeredSkill: string;
  requestedSkill: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  createdAt: string;
}

const STATUS_CONFIG = {
  pending:   { label: "Pending",   icon: Clock,         color: "text-yellow-400",       bg: "bg-yellow-400/10 border-yellow-400/20" },
  accepted:  { label: "Accepted",  icon: CheckCircle,   color: "text-admin-emerald",    bg: "bg-admin-emerald/10 border-admin-emerald/20" },
  completed: { label: "Completed", icon: CheckCircle,   color: "text-admin-blue",       bg: "bg-admin-blue/10 border-admin-blue/20" },
  rejected:  { label: "Rejected",  icon: XCircle,       color: "text-admin-rose",       bg: "bg-admin-rose/10 border-admin-rose/20" },
  cancelled: { label: "Cancelled", icon: XCircle,       color: "text-foreground/40",    bg: "bg-white/5 border-white/10" },
};

export default function AdminSwapsPage() {
  const [swaps, setSwaps] = useState<SwapRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSwaps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/swaps");
      const data = await res.json();
      if (res.ok) {
        setSwaps(data);
      } else {
        toast.error(data.error || "Failed to fetch swaps");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSwaps(); }, [fetchSwaps]);

  const columns: Column<SwapRecord>[] = [
    {
      header: "Requester",
      accessorKey: "requester",
      cell: (swap) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-admin-blue/10 border border-admin-blue/20 flex items-center justify-center text-admin-blue text-[10px] font-bold uppercase shrink-0">
            {swap.requester?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
          <span className="font-medium text-sm text-white">{swap.requester}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Receiver",
      accessorKey: "receiver",
      cell: (swap) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-admin-emerald/10 border border-admin-emerald/20 flex items-center justify-center text-admin-emerald text-[10px] font-bold uppercase shrink-0">
            {swap.receiver?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
          <span className="font-medium text-sm text-white">{swap.receiver}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Swap",
      accessorKey: "offeredSkill",
      cell: (swap) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 rounded-md bg-admin-blue/10 text-admin-blue border border-admin-blue/20 font-medium text-xs">{swap.offeredSkill}</span>
          <ArrowLeftRight className="w-3 h-3 text-foreground/30 shrink-0" />
          <span className="px-2 py-0.5 rounded-md bg-admin-emerald/10 text-admin-emerald border border-admin-emerald/20 font-medium text-xs">{swap.requestedSkill}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (swap) => {
        const cfg = STATUS_CONFIG[swap.status] || STATUS_CONFIG.cancelled;
        const Icon = cfg.icon;
        return (
          <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit", cfg.bg, cfg.color)}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
        );
      },
      sortable: true,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (swap) => (
        <div className="flex items-center gap-2 text-foreground/40 font-medium text-xs">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(swap.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      ),
      sortable: true,
    },
  ];

  const stats = {
    total: swaps.length,
    active: swaps.filter(s => s.status === "accepted").length,
    completed: swaps.filter(s => s.status === "completed").length,
    pending: swaps.filter(s => s.status === "pending").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Swaps</h2>
          <p className="text-foreground/40 font-medium mt-1">Monitor all skill swap transactions on the platform.</p>
        </div>
        <button onClick={fetchSwaps} className="p-2.5 bg-admin-surface border border-white/10 text-foreground/60 rounded-xl hover:text-white hover:bg-white/5 transition-all">
          <Loader2 className={cn("w-5 h-5", loading && "animate-spin")} />
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Swaps",  value: stats.total,     color: "text-white" },
          { label: "Pending",      value: stats.pending,   color: "text-yellow-400" },
          { label: "Active",       value: stats.active,    color: "text-admin-emerald" },
          { label: "Completed",    value: stats.completed, color: "text-admin-blue" },
        ].map(s => (
          <div key={s.label} className="bg-admin-surface border border-white/10 rounded-2xl p-5">
            <p className="text-foreground/40 text-xs font-semibold uppercase tracking-wider mb-2">{s.label}</p>
            <p className={cn("text-3xl font-bold tracking-tight", s.color)}>{loading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading && swaps.length === 0 ? (
        <div className="h-64 flex items-center justify-center bg-admin-surface border border-white/10 rounded-2xl">
          <Loader2 className="w-8 h-8 text-admin-emerald animate-spin" />
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={swaps}
          searchPlaceholder="Search swaps by name or skill..."
        />
      )}
    </div>
  );
}
