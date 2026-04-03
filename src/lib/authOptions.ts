import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) {
          throw new Error("Invalid credentials");
        }
        
        // If user logged in with OAuth before, they might not have a password
        if (!user.password) {
          throw new Error("Please log in with your social account.");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password as string);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
          image: user.avatar?.startsWith('http') ? user.avatar : undefined,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error("OAuth: Signin failed - No email provided by provider");
        return false;
      }
      
      // For Credentials provider, we already retrieved the user from DB in authorize()
      if (account?.provider === "credentials") {
        return true;
      }
      
      try {
        await dbConnect();
        
        let existingUser = await User.findOne({ email: user.email as string });
        
        if (!existingUser) {
          console.log(`OAuth: Creating new user for ${user.email}`);
          existingUser = await User.create({
            name: user.name || user.email.split("@")[0],
            email: user.email as string,
            avatar: user.image || undefined,
            role: "user",
            status: "active"
          });
        }
        
        (user as any).id = existingUser._id.toString();
        (user as any).role = existingUser.role || "user";
        return true;
      } catch (err: any) {
        console.error("OAuth: Error in signIn callback:", err.message);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev",
};
