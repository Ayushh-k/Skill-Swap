import mongoose, { Schema, Document, Model } from "mongoose";

export type SwapStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface ISwap extends Document {
  requester: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  offeredSkill: string;
  requestedSkill: string;
  status: SwapStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SwapSchema: Schema<ISwap> = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester ID is required"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required"],
    },
    offeredSkill: {
      type: String,
      required: [true, "Offered skill is required"],
      trim: true,
    },
    requestedSkill: {
      type: String,
      required: [true, "Requested skill is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected", "completed", "cancelled"],
        message: "{VALUE} is not a valid swap status",
      },
      default: "pending",
    },
    message: {
      type: String,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user cannot request a swap from themselves.
SwapSchema.pre("validate", function () {
  if (this.requester && this.receiver && this.requester.toString() === this.receiver.toString()) {
    this.invalidate("receiver", "You cannot request a swap with yourself.");
  }
});

if (mongoose.models.Swap) {
  mongoose.deleteModel("Swap");
}
export const Swap: Model<ISwap> = mongoose.model<ISwap>("Swap", SwapSchema);
