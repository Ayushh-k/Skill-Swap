"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOAuth(provider: string) {
    toast.error(`${provider} login requires OAuth configuration in production environment.`);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Area - Graphic */}
      <div className="hidden lg:flex relative flex-col justify-center items-center overflow-hidden border-r border-white/10 p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-surface/30 z-0" />
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-accent-indigo/10 blur-[150px] -z-10 animate-pulse" />
        
        <div className="relative z-10 w-full max-w-lg">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent-indigo mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Premium Access</span>
            </div>
            <h1 className="font-heading text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Unlock Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-indigo to-accent-teal">True Potential.</span>
            </h1>
            <p className="text-lg text-foreground/70">
              Enter your credentials to continue your journey of peer-to-peer knowledge swapping.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Area - Form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12">
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-accent-teal/10 rounded-full blur-[100px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4 }} 
          className="w-full max-w-[420px] space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="font-heading text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-foreground/70 mt-2 text-sm">Please enter your details to sign in.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" type="button" className="w-full relative h-12" onClick={() => handleOAuth('Google')}>
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Log in with Google
            </Button>
            <Button variant="outline" type="button" className="w-full relative h-12" onClick={() => handleOAuth('Microsoft')}>
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 21 21">
                <path fill="#f25022" d="M1 1h9v9H1z"/><path fill="#00a4ef" d="M1 11h9v9H1z"/><path fill="#7fba00" d="M11 1h9v9h-9z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/>
              </svg>
              Log in with Microsoft
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-foreground/50">Or continue with credentials</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white shadow-sm">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white/5 focus-visible:ring-accent-indigo/50 focus-visible:border-accent-indigo"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Password</label>
                <Link href="/forgot-password" className="text-xs text-accent-teal hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white/5 pr-10 focus-visible:ring-accent-indigo/50 focus-visible:border-accent-indigo"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-accent-indigo to-accent-teal border-0 hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all" isLoading={isLoading}>
              Log back in
            </Button>
          </form>

          <p className="text-center text-sm text-foreground/70">
            Don't have an account?{" "}
            <Link href="/signup" className="text-white hover:text-accent-teal font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
