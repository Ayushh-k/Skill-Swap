import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill-Swap Platform",
  description: "A bespoke premium platform for swapping skills seamlessly.",
};

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dbConnect from "@/lib/db";
import { Settings } from "@/models/Settings";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We keep the DB connection and session check for potential future use in the layout,
  // but we remove the problematic redirect() that caused the loop.
  // Global maintenance redirection will be handled more reliably in middleware.ts.
  await dbConnect();
  
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="font-sans bg-background text-foreground min-h-full flex flex-col selection:bg-accent-indigo/30 selection:text-white">
        <NextAuthProvider>
          <SocketProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster theme="dark" position="top-center" />
          </SocketProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
