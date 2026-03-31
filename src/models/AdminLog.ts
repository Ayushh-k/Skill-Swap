import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  target?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

const AdminLogSchema: Schema<IAdminLog> = new Schema({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  details: {
    type: Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const AdminLog: Model<IAdminLog> = 
  mongoose.models.AdminLog || mongoose.model<IAdminLog>("AdminLog", AdminLogSchema);
