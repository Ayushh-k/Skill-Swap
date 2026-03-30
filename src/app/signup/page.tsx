"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, Eye, EyeOff, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  
  // Form Step State
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  
  // Data State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  async function handleSendOtp() {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields first.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsSendingOtp(true);
    console.log("DEBUG: Attempting to send OTP to", email);
    try {
      const res = await fetch("/api/auth/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log("DEBUG: OTP Response Status:", res.status);
      const data = await res.json();
      console.log("DEBUG: OTP Response Data:", data);
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      
      toast.success("Verification code sent to your email!");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create account");
      
      toast.success("Account verified and created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOAuth(provider: string) {
    const providerId = provider.toLowerCase() === "microsoft" ? "azure-ad" : "google";
    signIn(providerId, { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background flex-row-reverse">
       {/* Right Area - Graphic */}
       <div className="hidden lg:flex relative flex-col justify-center items-center overflow-hidden border-l border-white/10 p-12 lg:order-last">
        <div className="absolute top-0 left-0 w-full h-full bg-surface/30 z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] bg-accent-teal/10 blur-[150px] -z-10 animate-pulse" />
        
        <div className="relative z-10 w-full max-w-lg">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent-teal mb-6">
              <Zap className="w-4 h-4" />
              <span>Join the Community</span>
            </div>
            <h1 className="font-heading text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Start Swapping <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-indigo">Skills Today.</span>
            </h1>
            <p className="text-lg text-foreground/70">
              Create your free account and access a global network of professionals looking to exchange expertise.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Left Area - Form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 lg:order-first overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-accent-indigo/10 rounded-full blur-[100px] -z-10" />
        
        <div className="w-full max-w-[420px]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center lg:text-left">
                  <h2 className="font-heading text-3xl font-bold text-white tracking-tight">Create an account</h2>
                  <p className="text-foreground/70 mt-2 text-sm">Join us to start learning and teaching.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button variant="outline" type="button" className="w-full relative h-12" onClick={() => handleOAuth('Google')}>
                    <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    Sign up with Google
                  </Button>
                  <Button variant="outline" type="button" className="w-full relative h-12" onClick={() => handleOAuth('Microsoft')}>
                    <svg className="w-5 h-5 absolute left-4" viewBox="0 0 21 21">
                      <path fill="#f25022" d="M1 1h9v9H1z"/><path fill="#00a4ef" d="M1 11h9v9H1z"/><path fill="#7fba00" d="M11 1h9v9h-9z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/>
                    </svg>
                    Sign up with Microsoft
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-foreground/50">Or register with email</span>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendOtp();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 bg-white/5 focus-visible:ring-accent-teal/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Email Address</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-white/5 focus-visible:ring-accent-teal/50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-12 bg-white/5 pr-10 focus-visible:ring-accent-teal/50"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Confirm</label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-12 bg-white/5 pr-10 focus-visible:ring-accent-teal/50"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-accent-teal to-accent-indigo border-0 hover:opacity-90 shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all mt-4" 
                    isLoading={isSendingOtp}
                  >
                    Verify Email <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <p className="text-center text-sm text-foreground/70">
                  Already have an account? <Link href="/login" className="text-white hover:text-accent-indigo font-medium font-heading">Log in</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center lg:text-left">
                  <div className="h-12 w-12 rounded-2xl bg-accent-teal/20 flex items-center justify-center text-accent-teal mb-6 mx-auto lg:mx-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-white tracking-tight">Verify your email</h2>
                  <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                    We've sent a 6-digit verification code to <span className="text-white font-medium">{email}</span>. Please enter it below to complete your registration.
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                       <Mail className="w-4 h-4 text-accent-teal" /> Verification Code
                    </label>
                    <Input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      className="h-16 bg-white/5 text-center text-3xl font-bold tracking-[0.5em] focus-visible:ring-accent-teal/50"
                      autoFocus
                    />
                    <p className="text-xs text-foreground/40 text-center">Didn't receive the code? <button type="button" onClick={handleSendOtp} className="text-accent-teal hover:underline" disabled={isSendingOtp}>Resend</button></p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="ghost" type="button" className="flex-1 h-12" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" className="flex-[2] h-12 bg-gradient-to-r from-accent-teal to-accent-indigo border-0" isLoading={isLoading}>
                      Verify & Sign Up
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
