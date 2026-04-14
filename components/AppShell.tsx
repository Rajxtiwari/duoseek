"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthNav from "@/components/AuthNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            DuoSeek
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Lobby", href: "/lobby" },
              { label: "Shuffle", href: "/shuffle" },
              { label: "How It Works", href: "/how-it-works" },
              { label: "FAQ", href: "/faq" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="text-zinc-400 hover:text-white transition-colors text-sm">
                {label}
              </Link>
            ))}
          </div>
          <AuthNav />
        </div>
      </nav>
      {children}
      <footer className="bg-glass border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="font-heading font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              DuoSeek
            </Link>
            <nav className="flex flex-wrap items-center gap-6">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Lobby", href: "/lobby" },
                { label: "Shuffle", href: "/shuffle" },
                { label: "How it Works", href: "/how-it-works" },
                { label: "Profile Settings", href: "/profile/settings" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="text-zinc-400 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
            <p className="text-zinc-600 text-xs">© 2026 DuoSeek. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </AuthProvider>
  );
}
