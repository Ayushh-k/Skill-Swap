"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-indigo/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-teal/20 blur-[120px] pointer-events-none" />

        <main className="container mx-auto px-4 pt-24 pb-16 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent-teal mb-4 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span>The future of peer-to-peer learning</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-heading text-5xl md:text-8xl font-bold tracking-tight text-white leading-tight">
              Master New Skills. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-indigo to-accent-teal">
                Exchange Wisdom.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
              A bespoke platform for professionals to swap expertise seamlessly. No money, just mutual growth and high-end connections.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto group">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  How it Works
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-32"
          >
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-accent-teal" />}
              title="Lightning Fast"
              description="Built on Next.js 15 App Router with optimized edge rendering for a blazing fast experience."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-accent-indigo" />}
              title="Secure Swaps"
              description="Strictly typed schemas and secure endpoints ensure your data and connections remain safe."
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-accent-teal" />}
              title="Premium Design"
              description="A bespoke Dark Glass aesthetic that feels custom-made and high-end at every interaction."
            />
          </motion.div>
        </main>
      </div>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="p-6 h-full flex flex-col gap-4 hover:bg-surface/60 transition-colors cursor-default group">
        <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all border border-white/5">
          {icon}
        </div>
        <h3 className="font-heading text-xl font-semibold text-white">{title}</h3>
        <p className="text-foreground/70 text-sm leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  )
}
