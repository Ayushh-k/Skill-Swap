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

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SocketProvider } from "@/components/providers/SocketProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="font-sans bg-background text-foreground min-h-full flex flex-col selection:bg-accent-indigo/30 selection:text-white">
        <SocketProvider>
          <Navbar />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <Toaster theme="dark" position="top-center" />
        </SocketProvider>
      </body>
    </html>
  );
}
