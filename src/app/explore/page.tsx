"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

type UserType = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio: string;
  connectionStatus?: string | null;
};

export default function Explore() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      (user.bio && user.bio.toLowerCase().includes(q)) ||
      user.skillsOffered?.some((s) => s.toLowerCase().includes(q)) ||
      user.skillsWanted?.some((s) => s.toLowerCase().includes(q))
    );
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Swap Form State
  const [offeredSkill, setOfferedSkill] = useState("");
  const [requestedSkill, setRequestedSkill] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleRequestSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser._id,
          offeredSkill,
          requestedSkill,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Swap request sent to ${selectedUser.name}!`);
      setIsModalOpen(false);
      setOfferedSkill("");
      setRequestedSkill("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] min-w-[300px] rounded-full bg-accent-teal/10 blur-[150px] -z-10 pointer-events-none" />
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white tracking-tight">Discovery Feed</h1>
            <p className="text-foreground/70 mt-3 text-base md:text-lg max-w-2xl leading-relaxed">
              Find professionals offering the skills you need and propose a mutual exchange.
            </p>
          </div>
          <div className="w-full md:w-[350px] relative">
            <Search className="w-5 h-5 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users or tech skills..." 
              className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-foreground/40 focus-visible:ring-accent-teal shadow-xl"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState 
            icon={Search}
            title={searchQuery ? "No matches found" : "No Users Found"}
            description={searchQuery ? `We couldn't find anyone matching "${searchQuery}".` : "There are currently no other users on the platform. Invite some friends to get started!"}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="p-4 sm:p-6 flex flex-col hover:bg-surface/60 transition-colors border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-accent-indigo to-accent-teal flex items-center justify-center text-white font-bold text-lg sm:text-xl uppercase shadow-inner border border-white/10 relative overflow-hidden shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name[0]
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">{user.name}</h3>
                    <p className="text-xs sm:text-sm text-foreground/50 truncate">{user.email}</p>
                  </div>
                </div>
                
                {user.bio && <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{user.bio}</p>}
                
                <div className="space-y-3 flex-grow mt-2">
                  <div>
                    <h4 className="text-xs font-semibold text-accent-teal uppercase tracking-wider mb-2">Can Teach</h4>
                    {user.skillsOffered?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skillsOffered.map(s => (
                          <span key={s} className="px-2 py-1 text-xs rounded-md bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : <span className="text-xs text-foreground/50">Not specified</span>}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-accent-indigo uppercase tracking-wider mb-2 pt-2">Wants to Learn</h4>
                    {user.skillsWanted?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skillsWanted.map(s => (
                          <span key={s} className="px-2 py-1 text-xs rounded-md bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : <span className="text-xs text-foreground/50">Not specified</span>}
                  </div>
                </div>

                {user.connectionStatus === "pending" ? (
                  <Button className="w-full mt-6 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/30" disabled>
                    Swap Requested
                  </Button>
                ) : user.connectionStatus === "accepted" ? (
                  <Link href="/dashboard" className="w-full mt-6 block">
                    <Button className="w-full border-accent-teal text-accent-teal hover:bg-accent-teal/10 hover:text-accent-teal" variant="outline">
                      Already Connected
                    </Button>
                  </Link>
                ) : user.connectionStatus === "rejected" ? (
                   <Button className="w-full mt-6 bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30" onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}>
                     Try Again
                   </Button>
                ) : (
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-accent-indigo to-accent-teal border-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:opacity-90 transition-all text-white font-semibold" 
                    onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                  >
                    Request Swap
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Swap Request to ${selectedUser?.name}`}>
        <form onSubmit={handleRequestSwap} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white shadow-sm">I want to learn:</label>
            <Input
              type="text"
              placeholder="E.g. Advanced React Patterns"
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white shadow-sm">I can offer:</label>
            <Input
              type="text"
              placeholder="E.g. Figma UI Design"
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white shadow-sm">Message (Optional):</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-surface/30 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo transition-colors resize-none"
              placeholder={`Hi ${selectedUser?.name.split(" ")[0] || ""}, I'd love to swap skills!`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Send Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
