"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Loader2, Settings, Mail, BookOpen, Star } from "lucide-react";
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

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name);
        setBio(data.bio || "");
        setSkillsOfferedInput(data.skillsOffered?.join(", ") || "");
        setSkillsWantedInput(data.skillsWanted?.join(", ") || "");
        setAvatarUrl(data.avatar || null);
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative flex-1 flex flex-col items-center">
        <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] min-w-[300px] rounded-full bg-accent-indigo/10 blur-[150px] -z-10 pointer-events-none" />
        
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-8 w-full max-w-2xl text-center sm:text-left">Your Profile</h1>

        {isLoading ? (
          <div className="py-24"><Loader2 className="h-8 w-8 animate-spin text-accent-indigo" /></div>
        ) : !profile ? (
          <p className="text-foreground/70">Failed to load profile.</p>
        ) : (
          <Card className="w-full max-w-2xl p-5 sm:p-8 bg-surface/30 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-300 border-white/5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8 mb-6 sm:mb-8">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-accent-indigo/60 to-accent-teal/60 flex flex-shrink-0 items-center justify-center text-white font-heading font-bold text-3xl sm:text-4xl uppercase border border-white/20 shadow-lg relative overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile.name[0]
                )}
              </div>
              <div className="space-y-1 sm:space-y-2 text-center sm:text-left flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{profile.name}</h2>
                <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-foreground/60 truncate">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" /> {profile.email}
                </div>
                {profile.bio && <p className="text-xs sm:text-sm mt-3 text-foreground/80 leading-relaxed max-w-md line-clamp-3">{profile.bio}</p>}
                {!profile.bio && <p className="text-xs text-foreground/40 italic">No bio provided.</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4 text-accent-teal">
                  <Star className="w-5 h-5" />
                  <h3 className="font-semibold text-lg text-white">Skills to Offer</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered?.length > 0 ? (
                    profile.skillsOffered.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 text-sm rounded-md bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
                        {skill}
                      </span>
                    ))
                  ) : <span className="text-sm text-foreground/50 italic">List skills you can teach others...</span>}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-accent-indigo">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-semibold text-lg text-white">Wants to Learn</h3>
                </div>
                 <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted?.length > 0 ? (
                    profile.skillsWanted.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 text-sm rounded-md bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20">
                        {skill}
                      </span>
                    ))
                  ) : <span className="text-sm text-foreground/50 italic">List skills you want to learn...</span>}
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Account Settings</p>
                <p className="text-xs text-foreground/60 hidden sm:block">Manage your profile details and skills</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                <Settings className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
          </Card>
        )}
      </main>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <form onSubmit={handleSave} className="space-y-4">
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
            <label className="text-sm font-medium text-white shadow-sm">Full Name:</label>
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
            <label className="text-sm font-medium text-white shadow-sm">Bio:</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-surface/30 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo transition-colors"
              placeholder="Tell others about your background..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white shadow-sm">Skills to Offer (comma-separated):</label>
            <Input
              type="text"
              placeholder="React, UI Design, Marketing"
              value={skillsOfferedInput}
              onChange={(e) => setSkillsOfferedInput(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white shadow-sm">Skills you want (comma-separated):</label>
            <Input
              type="text"
              placeholder="Python, Backend, AWS"
              value={skillsWantedInput}
              onChange={(e) => setSkillsWantedInput(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSaving} className="bg-accent-indigo hover:bg-accent-indigo/90">Save Changes</Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
