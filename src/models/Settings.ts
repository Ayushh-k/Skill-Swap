import mongoose, { Schema } from "mongoose";

const SettingsSchema = new Schema({
  siteName: { type: String, default: "Skill-Swap Platform" },
  allowSignups: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  requireEmailVerification: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 7 }, // in days
  adminAlerts: { type: Boolean, default: true },
  newUserAlerts: { type: Boolean, default: true },
  contactEmail: { type: String, default: "admin@skillswap.com" },
  maxSwapsPerUser: { type: Number, default: 10 },
  featureChat: { type: Boolean, default: true },
  featureAnalytics: { type: Boolean, default: true },
  themeColor: { type: String, default: "#10b981" }, // Default admin emerald
}, { timestamps: true });

export const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
