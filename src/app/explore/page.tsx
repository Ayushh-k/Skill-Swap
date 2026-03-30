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
import { useSocket } from "@/components/providers/SocketProvider";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.skillsOffered?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.skillsWanted?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedCategory === "All") return matchesSearch;
    
    // Simple category matching logic (can be expanded)
    const categoryKeywords: Record<string, string[]> = {
      "Design": ["design", "ui", "ux", "figma", "video", "graphics"],
      "Dev": ["dev", "code", "react", "next", "python", "backend", "frontend", "programming"],
      "Marketing": ["marketing", "seo", "social", "ads", "content"],
      "Business": ["business", "startup", "management", "sales", "finance"]
    };
    
    const keywords = categoryKeywords[selectedCategory] || [];
    const matchesCategory = 
      u.skillsOffered?.some(s => keywords.some(k => s.toLowerCase().includes(k))) ||
      u.skillsWanted?.some(s => keywords.some(k => s.toLowerCase().includes(k)));
    
    return matchesSearch && matchesCategory;
  });

  const { socket } = useSocket();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) setCurrentUser(await res.json());
      } catch (err) {}
    }
    fetchMe();
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
      
      // Real-time Notification
      if (socket) {
        socket.emit("new_swap_request", {
          receiverId: selectedUser._id,
          senderName: currentUser?.name || "Someone",
          requestedSkill,
        });
      }

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
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] min-w-[300px] rounded-full bg-accent-teal/10 blur-[150px] -z-10 pointer-events-none" />
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white tracking-tight">Explore Skills</h1>
          <p className="text-foreground/50 text-sm md:text-base">Find experts and propose a knowledge exchange.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-accent-teal transition-colors" />
            <Input 
              placeholder="Search skills or names..." 
              className="pl-10 bg-white/5 border-white/10 focus-visible:ring-accent-teal/50 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {["All", "Design", "Dev", "Marketing", "Business"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all whitespace-nowrap
                  ${selectedCategory === cat 
                    ? "bg-accent-teal/10 border-accent-teal text-accent-teal shadow-[0_0_10px_rgba(20,184,166,0.2)]" 
                    : "bg-white/5 border-white/10 text-foreground/60 hover:border-white/20"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState 
          icon={Search}
          title="No Experts Found"
          description="We couldn't find any skill swappers matching your search. Try different keywords or check back later!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="group bg-surface/40 border-white/5 hover:border-accent-teal/30 hover:bg-surface/60 transition-all duration-300 flex flex-col h-full overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent-indigo/20 to-accent-teal/20 flex items-center justify-center text-white font-bold text-2xl border border-white/10 group-hover:scale-110 transition-transform duration-300 overflow-hidden relative">
                     {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user.name[0] || "?")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white truncate leading-tight mb-1">{user.name}</h3>
                    <p className="text-xs text-foreground/40 font-medium truncate">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-5 flex-1">
                  <div>
                    <h4 className="text-[10px] font-bold text-accent-teal uppercase tracking-widest mb-2 opacity-80">Teaches</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skillsOffered && user.skillsOffered.length > 0 ? (
                        user.skillsOffered.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-accent-teal/5 text-accent-teal text-[10px] border border-accent-teal/10">{s}</span>
                        ))
                      ) : <span className="text-[10px] text-foreground/30 italic">Not listed</span>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-accent-indigo uppercase tracking-widest mb-2 opacity-80">Wants to Learn</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skillsWanted && user.skillsWanted.length > 0 ? (
                        user.skillsWanted.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-accent-indigo/5 text-accent-indigo text-[10px] border border-accent-indigo/10">{s}</span>
                        ))
                      ) : <span className="text-[10px] text-foreground/30 italic">Not listed</span>}
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-accent-indigo to-accent-teal hover:opacity-90 text-white font-bold h-11 border-0 shadow-lg group-hover:shadow-accent-teal/20 transition-all"
                  onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                >
                  Swap Skills
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Swap Request to ${selectedUser?.name}`}>
        <form onSubmit={handleRequestSwap} className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white mb-2 block">I want to learn:</label>
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
              <label className="text-sm font-bold text-white mb-2 block">I can offer:</label>
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
              <label className="text-sm font-bold text-white mb-2 block">Message (Optional):</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo transition-colors resize-none"
                placeholder={`Hi ${selectedUser?.name.split(" ")[0] || ""}, I'd love to swap skills!`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
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
