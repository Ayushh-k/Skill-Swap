"use client";

import { ChevronLeft, LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: React.ReactNode;
  lastUpdated: string;
}

export default function LegalPageLayout({
  title,
  subtitle,
  icon: Icon,
  children,
  lastUpdated,
}: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen py-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-accent-indigo/5 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-accent-teal/5 blur-[150px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/40 hover:text-accent-teal transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6 mb-16 text-center md:text-left"
        >
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-indigo/20 to-accent-teal/20 items-center justify-center border border-white/10 mb-4 mx-auto md:mx-0">
            <Icon className="w-6 h-6 text-accent-teal" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          <div className="pt-4 flex items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-foreground/30">
            <span>Last Updated: {lastUpdated}</span>
            <span className="h-1 w-1 rounded-full bg-foreground/20" />
            <span>v1.0.0</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-8 md:p-12 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative prose prose-invert prose-p:text-foreground/80 prose-headings:text-white prose-headings:font-heading prose-headings:font-bold prose-strong:text-accent-teal prose-a:text-accent-indigo hover:prose-a:text-accent-teal prose-a:transition-colors max-w-none">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
