import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    skillsOffered: {
      type: [String],
      default: [],
      validate: [
        (val: string[]) => val.length <= 10,
        "Cannot offer more than 10 skills",
      ],
    },
    skillsWanted: {
      type: [String],
      default: [],
      validate: [
        (val: string[]) => val.length <= 10,
        "Cannot want more than 10 skills",
      ],
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose form creating new schemas if it's already created during Next.js Hot Reloads
if (mongoose.models.User) {
  mongoose.deleteModel("User");
}
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
