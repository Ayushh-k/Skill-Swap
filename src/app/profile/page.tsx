"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Edit2, CheckCircle, Globe, ShieldCheck, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skillsOfferedInput, setSkillsOfferedInput] = useState("");
  const [skillsWantedInput, setSkillsWantedInput] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Deletion State
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setProfile(data);
          setName(data.name || "");
          setBio(data.bio || "");
          setSkillsOfferedInput(data.skillsOffered?.join(", ") || "");
          setSkillsWantedInput(data.skillsWanted?.join(", ") || "");
          setAvatarUrl(data.avatar || null);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    const skillsOffered = skillsOfferedInput.split(",").map(s => s.trim()).filter(Boolean);
    const skillsWanted = skillsWantedInput.split(",").map(s => s.trim()).filter(Boolean);
    
    if (skillsOffered.length > 10 || skillsWanted.length > 10) {
      toast.error("You can only have up to 10 skills in each category.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, skillsOffered, skillsWanted, avatar: avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      
      toast.success("Profile updated successfully!");
      setProfile(data);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("Image must be smaller than 2MB");
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function handleDeleteAccount() {
    setIsDeletingAccount(true);
    try {
      const res = await fetch("/api/users/profile", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      
      toast.success("Account deleted successfully.");
      window.location.href = "/login"; 
    } catch (error: any) {
      toast.error(error.message);
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 relative flex-1 flex flex-col items-center">
        <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] min-w-[300px] rounded-full bg-accent-indigo/10 blur-[150px] -z-10 pointer-events-none" />
        
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-8 w-full max-w-2xl text-center sm:text-left">Your Profile</h1>

        {isLoading ? (
          <div className="py-24 flex justify-center w-full">
            <Loader2 className="h-8 w-8 animate-spin text-accent-indigo" />
          </div>
        ) : profile ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl space-y-6"
          >
            <Card className="p-8 bg-surface/40 border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="sm" className="hover:bg-white/10 text-white/60 hover:text-white" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-8 mb-10">
                <div className="relative group/avatar">
                  <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-teal flex items-center justify-center text-white font-bold text-4xl border border-white/10 shadow-inner overflow-hidden">
                    {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" alt="Profile" /> : (profile.name?.[0] || "?")}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-accent-teal rounded-lg p-1.5 shadow-lg border border-white/10">
                    <CheckCircle className="w-4 h-4 text-background" />
                  </div>
                </div>

                <div className="text-center sm:text-left pt-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h2>
                  <p className="text-foreground/50 font-medium mb-4">{profile.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-foreground/70">
                      <div className="h-2 w-2 rounded-full bg-accent-teal" />
                      Expert Swapper
                    </div>
                    <div className="flex items-center gap-1.5 text-foreground/70">
                      <div className="h-2 w-2 rounded-full bg-accent-indigo" />
                      {profile.skillsOffered?.length || 0} Skills Shared
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4 opacity-50">Biography</h4>
                  <p className="text-foreground/80 leading-relaxed italic line-clamp-3">
                    {profile.bio || "No bio added yet. Tell people about your expertise and what makes you a great swap partner!"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-accent-teal uppercase tracking-[0.2em] opacity-50">Mastery (Teaches)</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillsOffered?.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-lg bg-accent-teal/10 text-accent-teal border border-accent-teal/20 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-accent-indigo uppercase tracking-[0.2em] opacity-50">Interests (Wants to Learn)</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillsWanted?.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-lg bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-between items-center text-xs text-foreground/40">
                <p>Member since {new Date().getFullYear()}</p>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Verified Expert</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure Account</span>
                </div>
              </div>
            </Card>

            <div className="pt-8 mt-8 border-t border-white/5">
              <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
                <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
                <p className="text-sm text-foreground/50 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <Button 
                  variant="outline" 
                  className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete My Profile
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-foreground/40">
            <Mail className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-heading text-xl">Profile unreachable.</p>
          </div>
        )}

        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <label className="relative cursor-pointer group rounded-full overflow-hidden h-24 w-24 border border-white/10 shadow-lg flex items-center justify-center bg-gradient-to-br from-accent-indigo to-accent-teal text-white font-bold text-4xl uppercase shrink-0 transition-transform hover:scale-105">
                {avatarUrl ? (
                   <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   name?.[0] || "?"
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-xs font-semibold backdrop-blur-sm transition-all text-center leading-tight">
                  Change Photo
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <p className="text-xs text-foreground/40 mt-2">Max limit: 2MB</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white mb-2 block">Full Name:</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/5 border-white/10"
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white mb-2 block">Bio:</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo transition-colors"
                placeholder="Tell others about your background..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white mb-2 block">Skills to Offer (comma-separated):</label>
              <Input
                type="text"
                placeholder="React, UI Design, Marketing"
                value={skillsOfferedInput}
                onChange={(e) => setSkillsOfferedInput(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-white mb-2 block">Skills you want (comma-separated):</label>
              <Input
                type="text"
                placeholder="Python, Backend, AWS"
                value={skillsWantedInput}
                onChange={(e) => setSkillsWantedInput(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setShowDeleteModal(true); }}
                className="text-xs text-red-500/60 hover:text-red-500 transition-colors font-medium"
              >
                Delete Account
              </button>
              <div className="flex gap-3">
                <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" isLoading={isSaving} className="bg-accent-indigo hover:bg-accent-indigo/90">Save Changes</Button>
              </div>
            </div>
          </form>
        </Modal>

        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Your Profile?">
          <div className="space-y-4 pt-4">
            <p className="text-sm text-foreground/70 leading-relaxed">
              Are you absolutely sure you want to delete your profile? This action will:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/60 space-y-2">
              <li>Permanently delete your profile information.</li>
              <li>Remove all your expertise and interest listings.</li>
              <li>Delete all your active and previous skill swap requests.</li>
            </ul>
            <p className="text-sm font-bold text-red-500">This action cannot be undone.</p>
            
            <div className="flex gap-3 justify-end pt-6 border-t border-white/5">
              <Button variant="ghost" type="button" onClick={() => setShowDeleteModal(false)}>Keep My Profile</Button>
              <Button 
                type="button" 
                isLoading={isDeletingAccount} 
                className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20 px-8"
                onClick={handleDeleteAccount}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
}
