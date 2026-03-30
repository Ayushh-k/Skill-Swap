"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck, UserPlus, Search, MessageSquare, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <div className="relative overflow-hidden flex-1">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-indigo/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-teal/20 blur-[120px] pointer-events-none" />

        <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          {/* Hero Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto space-y-8 min-h-[70vh] flex flex-col justify-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent-teal mb-4 backdrop-blur-md self-center">
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
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <div className="py-24">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto"
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
          </div>

          {/* Pathways / How it Works Section */}
          <div className="py-32 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">How it Works</h2>
                <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                  Skill-Swap is built on the principle of direct reciprocity. Follow these simple steps to start your first exchange.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <PathwayStep 
                  number="01"
                  icon={<UserPlus className="w-6 h-6" />}
                  title="Craft Your Profile"
                  description="Highlight your mastery and pinpoint the knowledge you crave from others."
                />
                <PathwayStep 
                  number="02"
                  icon={<Search className="w-6 h-6" />}
                  title="Discover Expert"
                  description="Use our smart filters to find professionals who match your learning goals."
                />
                <PathwayStep 
                  number="03"
                  icon={<MessageSquare className="w-6 h-6" />}
                  title="Propose a Swap"
                  description="Reach out with a personalized request to trade your skills with theirs."
                />
                <PathwayStep 
                  number="04"
                  icon={<GraduationCap className="w-6 h-6" />}
                  title="Elevate Together"
                  description="Connect via real-time chat and video calls to master new disciplines."
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="py-32 border-t border-white/5 bg-white/[0.02]">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="space-y-4">
                <h2 className="font-heading text-4xl font-bold text-white">Our Mission</h2>
                <p className="text-xl text-foreground/80 leading-relaxed italic border-l-4 border-accent-indigo pl-8 py-4 bg-accent-indigo/5 rounded-r-2xl">
                  "We believe that every professional has a treasure of hidden wisdom. Our goal is to democratize learning by removing the barrier of cost, replacing it with the power of human connection."
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                <div className="p-8 rounded-3xl bg-surface/40 border border-white/10 space-y-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal">
                      1
                    </div>
                    Reciprocity
                  </h4>
                  <p className="text-sm text-foreground/60">Every interaction is built on mutual benefit. When you teach, you learn. When you share, you grow.</p>
                </div>
                <div className="p-8 rounded-3xl bg-surface/40 border border-white/10 space-y-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent-indigo/20 flex items-center justify-center text-accent-indigo">
                      2
                    </div>
                    Excellence
                  </h4>
                  <p className="text-sm text-foreground/60">Our platform is designed for professionals who value quality and high-end aesthetic experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="p-6 h-full flex flex-col gap-4 hover:bg-surface/60 transition-colors cursor-default group border-white/5">
        <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all border border-white/5">
          {icon}
        </div>
        <h3 className="font-heading text-xl font-semibold text-white">{title}</h3>
        <p className="text-foreground/70 text-sm leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  )
}

function PathwayStep({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group p-6 rounded-3xl bg-surface/30 border border-white/5 hover:border-accent-teal/50 transition-all"
    >
      <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-to-br from-accent-indigo to-accent-teal flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="mt-4 space-y-4">
        <div className="p-3 w-fit rounded-2xl bg-white/5 text-accent-teal group-hover:bg-accent-teal/10 transition-colors">
          {icon}
        </div>
        <h3 className="font-heading text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-foreground/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
