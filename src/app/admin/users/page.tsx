"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Calendar, 
  Trash2, 
  Ban as BanIcon, 
  Loader2, 
  X,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/components/providers/SocketProvider";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "banned" | "pending";
  joinDate: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: "ban" | "delete"; user: UserRecord | null }>({ type: "ban", user: null });
  const { socket } = useSocket();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        toast.error(data.error || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Network error fetching users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("join_admin");
      socket.on("refresh_data", (data: { type: string }) => {
        if (data.type === "users" || data.type === "all") {
          fetchUsers();
        }
      });
      return () => {
        socket.off("refresh_data");
      };
    }
  }, [socket, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (type: "ban" | "delete", user: UserRecord) => {
    setPendingAction({ type, user });
    setIsConfirmModalOpen(true);
  };

  const executeAction = async () => {
    if (!pendingAction.user) return;
    const { type, user } = pendingAction;
    
    setLoading(true);
    setIsConfirmModalOpen(false);

    try {
      if (type === "ban") {
        const newStatus = user.status === "banned" ? "active" : "banned";
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
          toast.success(`User ${user.name} is now ${newStatus}`);
          await fetchUsers();
          // Emit internal refresh for other admin tabs
          if (socket) socket.emit("admin_refresh", "users");
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to update user");
        }
      } else if (type === "delete") {
        const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success(`User ${user.name} deleted permanently`);
          await fetchUsers();
          if (socket) socket.emit("admin_refresh", "users");
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to delete user");
        }
      }
    } catch (error) {
      toast.error("Action failed due to network error");
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<UserRecord>[] = [
    {
      header: "User",
      accessorKey: "name",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-admin-emerald/10 border border-admin-emerald/20 flex items-center justify-center text-admin-emerald text-xs font-bold shrink-0 uppercase">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <p className="font-bold text-white tracking-tight">{user.name}</p>
            <div className="flex items-center gap-1 text-[11px] text-foreground/40 font-medium">
              <Mail className="w-3 h-3" />
              {user.email}
            </div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          user.role === "admin" ? "bg-admin-emerald/10 text-admin-emerald border-admin-emerald/20" : "bg-white/5 text-foreground/60 border-white/10"
        )}>
          {user.role}
        </span>
      ),
      sortable: true
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (user) => (
        <div className="flex items-center gap-2">
          {user.status === "active" ? (
            <ShieldCheck className="w-4 h-4 text-admin-emerald" />
          ) : user.status === "banned" ? (
            <ShieldAlert className="w-4 h-4 text-admin-rose" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-dashed border-foreground/20" />
          )}
          <span className={cn(
            "text-xs font-bold capitalize",
            user.status === "active" ? "text-admin-emerald" : 
            user.status === "banned" ? "text-admin-rose" : "text-foreground/40"
          )}>
            {user.status}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      header: "Joined",
      accessorKey: "joinDate",
      cell: (user) => (
        <div className="flex items-center gap-2 text-foreground/40 font-medium">
          <Calendar className="w-4 h-4" />
          {new Date(user.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      ),
      sortable: true
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (user) => <ActionMenu user={user} onAction={handleAction} />
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Users</h2>
          <p className="text-foreground/40 font-medium mt-1">Manage platform members and their membership status.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="p-2.5 bg-admin-surface border border-white/10 text-foreground/60 rounded-xl hover:text-white hover:bg-white/5 transition-all"
        >
          <Loader2 className={cn("w-5 h-5", loading && "animate-spin")} />
        </button>
      </div>

      {loading && users.length === 0 ? (
        <div className="h-64 flex items-center justify-center bg-admin-surface border border-white/10 rounded-2xl">
          <Loader2 className="w-8 h-8 text-admin-emerald animate-spin" />
        </div>
      ) : (
        <AdminDataTable 
          columns={columns} 
          data={users} 
          searchPlaceholder="Filter users by name or email..."
          onAction={(user) => {
            toast.info(`Viewing details for ${user.name}`);
          }}
        />
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsConfirmModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-admin-surface border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setIsConfirmModalOpen(false)} className="text-foreground/20 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center mb-6",
                pendingAction.type === "delete" ? "bg-admin-rose/10 text-admin-rose" : "bg-admin-blue/10 text-admin-blue"
              )}>
                {pendingAction.type === "delete" ? <Trash2 className="w-8 h-8" /> : <BanIcon className="w-8 h-8" />}
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                {pendingAction.type === "delete" ? "Delete User?" : 
                 pendingAction.user?.status === "banned" ? "Unban User?" : "Ban User?"}
              </h3>
              <p className="text-foreground/40 font-medium mb-8">
                Are you sure you want to {pendingAction.type === "delete" ? "permanently delete" : "change the status for" } 
                <span className="text-white ml-1 font-bold">{pendingAction.user?.name}</span>? 
                {pendingAction.type === "delete" && " This action cannot be undone."}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-foreground/60 font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className={cn(
                    "py-3 px-6 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]",
                    pendingAction.type === "delete" ? "bg-admin-rose text-white hover:bg-admin-rose/80" : 
                    pendingAction.user?.status === "banned" ? "bg-admin-emerald text-black hover:bg-admin-emerald/80" : "bg-admin-blue text-white hover:bg-admin-blue/80"
                  )}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionMenu({ user, onAction }: { user: UserRecord, onAction: (type: "ban" | "delete", user: UserRecord) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [isOpen]);

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-white transition-all shadow-sm"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-admin-surface border border-white/10 shadow-2xl z-[100] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1">
              <button
                onClick={() => {
                  onAction("ban", user);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <BanIcon className="w-4 h-4" />
                {user.status === "banned" ? "Unban User" : "Ban User"}
              </button>
              <button
                onClick={() => {
                  onAction("delete", user);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-admin-rose/60 hover:text-admin-rose hover:bg-admin-rose/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
