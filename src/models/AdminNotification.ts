import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminNotification extends Document {
  type: "new_user" | "new_swap" | "security_flag" | "system_alert";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: any;
  createdAt: Date;
}

const AdminNotificationSchema: Schema<IAdminNotification> = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["new_user", "new_swap", "security_flag", "system_alert"],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.AdminNotification) {
  mongoose.deleteModel("AdminNotification");
}

export const AdminNotification: Model<IAdminNotification> = 
  mongoose.models.AdminNotification || mongoose.model<IAdminNotification>("AdminNotification", AdminNotificationSchema);
