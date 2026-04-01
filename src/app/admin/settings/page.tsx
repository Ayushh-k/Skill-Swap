"use client";

import { useState } from "react";
import { Shield, Bell, Database, Globe, Key, Save, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SECTIONS = [
  { id: "general",    icon: Globe,     label: "General" },
  { id: "security",   icon: Shield,    label: "Security" },
  { id: "notifications", icon: Bell,   label: "Notifications" },
  { id: "database",   icon: Database,  label: "Database" },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // General settings state
  const [siteName, setSiteName] = useState("Skill-Swap Platform");
  const [allowSignups, setAllowSignups] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security settings state
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("7");

  // Notification settings state
  const [adminAlerts, setAdminAlerts] = useState(true);
  const [newUserAlerts, setNewUserAlerts] = useState(true);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate save
    setSaving(false);
    setSaved(true);
    toast.success("Settings saved successfully!");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
          <p className="text-foreground/40 font-medium mt-1">Configure platform-wide behavior and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-admin-emerald text-black rounded-xl font-bold text-sm hover:bg-admin-emerald/90 transition-all disabled:opacity-60 shadow-lg shadow-admin-emerald/20"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar Nav */}
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all w-full text-left",
                activeSection === s.id
                  ? "bg-admin-emerald/10 text-admin-emerald border border-admin-emerald/20"
                  : "text-foreground/50 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <s.icon className="w-4 h-4 shrink-0" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="bg-admin-surface border border-white/10 rounded-2xl p-8 space-y-8">

          {activeSection === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">General Settings</h3>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/70">Platform Name</label>
                <input
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-admin-emerald/50 transition-colors"
                />
              </div>
              <ToggleRow label="Allow New Signups" description="Enable or disable new user registration." value={allowSignups} onChange={setAllowSignups} />
              <ToggleRow label="Maintenance Mode" description="Show a maintenance page to all visitors." value={maintenanceMode} onChange={setMaintenanceMode} danger />
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Security Settings</h3>
              <ToggleRow label="Require Email Verification" description="New users must verify their email before accessing the platform." value={requireEmailVerification} onChange={setRequireEmailVerification} />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/70">Session Timeout (days)</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full max-w-xs bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-admin-emerald/50 transition-colors"
                />
                <p className="text-xs text-foreground/30">Users will be logged out after this many days of inactivity.</p>
              </div>
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <Key className="w-4 h-4 text-yellow-500 mb-2" />
                <p className="text-xs text-yellow-400/80 font-medium">JWT Secret and NextAuth Secret are managed via environment variables. Update them in your <code className="bg-white/10 px-1 rounded">.env.local</code> file.</p>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Notification Settings</h3>
              <ToggleRow label="Admin Alerts" description="Receive system-level alerts in the admin notification dropdown." value={adminAlerts} onChange={setAdminAlerts} />
              <ToggleRow label="New User Alerts" description="Create an admin notification whenever a new user signs up." value={newUserAlerts} onChange={setNewUserAlerts} />
            </div>
          )}

          {activeSection === "database" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Database Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Database", value: "MongoDB Atlas" },
                  { label: "Cluster", value: "kaptaaan" },
                  { label: "Database Name", value: "skill-swap" },
                  { label: "Connection", value: "✅ Connected" },
                ].map(item => (
                  <div key={item.label} className="p-4 bg-background rounded-xl border border-white/5">
                    <p className="text-xs text-foreground/40 font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-admin-blue/5 border border-admin-blue/20 rounded-xl">
                <p className="text-xs text-admin-blue/80 font-medium">
                  Database connection string is configured via <code className="bg-white/10 px-1 rounded">MONGODB_URI</code> environment variable. Never expose your connection string publicly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange, danger = false }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-white/5 last:border-0">
      <div>
        <p className={cn("text-sm font-semibold", danger ? "text-admin-rose" : "text-white")}>{label}</p>
        <p className="text-xs text-foreground/40 mt-0.5 max-w-xs">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 mt-0.5",
          value
            ? danger ? "bg-admin-rose" : "bg-admin-emerald"
            : "bg-white/10"
        )}
      >
        <span className={cn(
          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
          value ? "translate-x-6" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}
