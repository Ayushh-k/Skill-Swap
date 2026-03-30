"use client";

import { Mail, Globe, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/swap/")) {
    return null; // Hide footer purely on chat pages to save vertical space
  }

  return (
    <footer className="w-full border-t border-white/10 bg-background/80 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="font-heading text-xl font-bold tracking-tight text-white flex items-center gap-2 group mb-4">
              <img src="/logo.png" alt="Skill-Swap Logo" className="h-12 sm:h-14 w-auto object-contain scale-[1.5] sm:scale-[2.0] origin-left transition-transform ml-2 sm:ml-4" />
            </Link>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
              The world's premium peer-to-peer knowledge exchange platform. Build connections, share wisdom, and grow without boundaries.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li><Link href="/explore" className="hover:text-accent-teal transition-colors">Explore Skills</Link></li>
                <li><Link href="/dashboard" className="hover:text-accent-teal transition-colors">Dashboard</Link></li>
                <li><Link href="/signup" className="hover:text-accent-teal transition-colors">Join Now</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li><Link href="/guidelines" className="hover:text-accent-teal transition-colors">Guidelines</Link></li>
                <li><Link href="/privacy" className="hover:text-accent-teal transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-accent-teal transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Developer Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider transition-all">Developer</h4>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent-indigo/20 flex items-center justify-center border border-accent-indigo/30">
                  <span className="text-accent-indigo font-bold">AK</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ayush Kamboj</p>
                  <p className="text-[11px] text-foreground/50">Full-Stack Developer</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <a href="mailto:ayushkamboj9690@gmail.com" className="flex items-center gap-2 text-xs text-foreground/60 hover:text-accent-teal transition-colors group">
                  <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  ayushkamboj9690@gmail.com
                </a>
                <a href="https://ayush-kptn-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-foreground/60 hover:text-accent-teal transition-colors group">
                  <Globe className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  Visit Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/30">
            © {new Date().getFullYear()} Skill-Swap. Built with passion for collaborative learning.
          </p>
          <div className="flex items-center gap-2 text-xs text-foreground/30">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" /> by 
            <span className="text-foreground/60 font-medium">Ayush Kamboj</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
