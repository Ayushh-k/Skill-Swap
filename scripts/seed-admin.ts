import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const adminEmail = "admin@skillswap.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("Admin user already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);
  
  await User.create({
    name: "System Administrator",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    skillsOffered: ["System Management", "Security"],
    skillsWanted: ["Feedback"],
    bio: "Chief Administrator for the Skill-Swap platform."
  });

  console.log("Admin user created successfully!");
  console.log("Email: admin@skillswap.com");
  console.log("Password: admin123");
  
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
