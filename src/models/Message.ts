import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  swapId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  type: "text" | "file" | "system";
  fileUrl?: string;
  isRead: boolean;
  replyTo?: mongoose.Types.ObjectId | any;
  reactions?: Map<string, string>;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    swapId: { type: Schema.Types.ObjectId, ref: "Swap", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ["text", "file", "system"], default: "text" },
    fileUrl: { type: String },
    isRead: { type: Boolean, default: false },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    reactions: { type: Map, of: String, default: {} },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.Message) {
  mongoose.deleteModel("Message");
}

export const Message: Model<IMessage> = mongoose.model<IMessage>("Message", MessageSchema);
