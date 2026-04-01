"use client";

import { useState, useEffect } from "react";
import { Shield, Bell, Database, Globe, Key, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DynamicButton from "@/components/admin/DynamicButton";

const SECTIONS = [
  { id: "general",    icon: Globe,     label: "General" },
  { id: "security",   icon: Shield,    label: "Security" },
  { id: "notifications", icon: Bell,   label: "Alerts" },
  { id: "database",   icon: Database,  label: "Platform" },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "",
    allowSignups: true,
    maintenanceMode: false,
    requireEmailVerification: false,
    sessionTimeout: 7,
    adminAlerts: true,
    newUserAlerts: true,
    contactEmail: "",
    maxSwapsPerUser: 10,
    featureChat: true,
    featureAnalytics: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (res.ok) setSettings(data);
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("Network error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-admin-surface border border-white/10 rounded-2xl">
        <Loader2 className="w-8 h-8 text-admin-emerald animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
          <p className="text-foreground/40 font-medium mt-1">Configure platform rules and administrative preferences.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-emerald/10 border border-admin-emerald/20">
          <CheckCircle className="w-4 h-4 text-admin-emerald" />
          <span className="text-[10px] font-bold text-admin-emerald uppercase tracking-wider">System Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm",
                activeSection === section.id 
                  ? "bg-admin-emerald/10 text-admin-emerald border border-admin-emerald/20" 
                  : "text-foreground/40 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <section.icon className="w-5 h-5 shrink-0" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="p-8 rounded-3xl bg-admin-surface border border-white/10 shadow-2xl space-y-8">
            
            {activeSection === "general" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Platform Name</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-admin-emerald/50 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Public Contact Email</label>
                  <input 
                    type="email" 
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-admin-emerald/50 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <Toggle 
                  label="Maintenance Mode" 
                  description="Disable all public-facing features except for Admins."
                  enabled={settings.maintenanceMode}
                  onChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
                />
                <Toggle 
                  label="New Member Onboarding" 
                  description="Allow new users to sign up to the platform."
                  enabled={settings.allowSignups}
                  onChange={(val) => setSettings({ ...settings, allowSignups: val })}
                />
                <Toggle 
                  label="Mandatory Verification" 
                  description="Require email OTP verification for all actions."
                  enabled={settings.requireEmailVerification}
                  onChange={(val) => setSettings({ ...settings, requireEmailVerification: val })}
                />
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <Toggle 
                  label="System Notifications" 
                  description="Send alerts for platform-wide events."
                  enabled={settings.adminAlerts}
                  onChange={(val) => setSettings({ ...settings, adminAlerts: val })}
                />
                <Toggle 
                  label="New Signup Alerts" 
                  description="Notify administrators of every new member."
                  enabled={settings.newUserAlerts}
                  onChange={(val) => setSettings({ ...settings, newUserAlerts: val })}
                />
              </div>
            )}

            {activeSection === "database" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Default Max Swaps</label>
                    <input 
                      type="number" 
                      value={settings.maxSwapsPerUser}
                      onChange={(e) => setSettings({ ...settings, maxSwapsPerUser: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-admin-emerald/50 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Session Expiry (Days)</label>
                    <input 
                      type="number" 
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-admin-emerald/50 transition-all font-medium"
                    />
                  </div>
                </div>
                <Toggle 
                  label="Real-time Chat" 
                  description="Enable/Disable P2P private messaging."
                  enabled={settings.featureChat}
                  onChange={(val) => setSettings({ ...settings, featureChat: val })}
                />
                <Toggle 
                  label="Global Analytics" 
                  description="Enable/Disable platform performance tracking."
                  enabled={settings.featureAnalytics}
                  onChange={(val) => setSettings({ ...settings, featureAnalytics: val })}
                />
              </div>
            )}

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <DynamicButton
                label={saving ? "Saving..." : "Save Changes"}
                topDrawerText="💾 Persist Settings"
                bottomDrawerText="Update Platform"
                onClick={handleSave}
                disabled={saving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, description, enabled, onChange }: { label: string, description: string, enabled: boolean, onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between group">
      <div>
        <p className="text-sm font-bold text-white group-hover:text-admin-emerald transition-colors">{label}</p>
        <p className="text-xs text-foreground/40 mt-1 font-medium">{description}</p>
      </div>
      <button 
        onClick={() => onChange(!enabled)}
        className={cn(
          "h-6 w-12 rounded-full relative transition-all duration-300",
          enabled ? "bg-admin-emerald" : "bg-white/10"
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
          enabled ? "left-7" : "left-1"
        )} />
      </button>
    </div>
  );
}
