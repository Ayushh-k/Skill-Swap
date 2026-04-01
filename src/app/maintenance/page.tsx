"use client";

import { motion } from "framer-motion";
import { Hammer, Sparkles, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent-indigo/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent-teal/10 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-teal mb-4">
          <Hammer className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Under Maintenance</span>
        </div>

        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-white leading-none">
          Upgrading Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-indigo via-accent-secondary to-accent-teal">Experience.</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/60 max-w-lg mx-auto">
          We're currently performing some scheduled maintenance to bring you new features and a smoother experience. We'll be back shortly!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
           <Link href="/">
            <Button variant="premium" className="w-[180px] h-12">
              Check Again
            </Button>
           </Link>
           <div className="flex items-center gap-2 px-4 py-2 text-foreground/40 text-sm font-medium">
             <Sparkles className="w-4 h-4 text-accent-indigo" />
             Something big is coming...
           </div>
        </div>

        <div className="pt-16 border-t border-white/5 grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter mb-1">Status</p>
            <p className="text-sm font-bold text-amber-500">Scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter mb-1">Impact</p>
            <p className="text-sm font-bold text-white">Temporary</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter mb-1">Region</p>
            <p className="text-sm font-bold text-white">Global</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
