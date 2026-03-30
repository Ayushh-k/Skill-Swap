import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";

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
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      await dbConnect();
      
      let existingUser = await User.findOne({ email: user.email as string });
      
      if (!existingUser) {
        existingUser = await User.create({
          name: user.name || user.email.split("@")[0],
          email: user.email as string,
          avatar: user.image || undefined,
        });
      }
      
      (user as any).id = existingUser._id.toString();
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
