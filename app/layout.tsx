import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DuoSeek – Find Your Perfect Gaming Duo",
  description: "DuoSeek connects verified gamers through smart random matchmaking. Share gameplay reels, link your Riot ID or Steam, and find your perfect duo instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-zinc-950 min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
            <a href="/" className="font-heading font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              DuoSeek
            </a>
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "How It Works", href: "/how-it-works" },
                { label: "FAQ", href: "/faq" },
                { label: "Safety", href: "/safety" },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="text-zinc-400 hover:text-white transition-colors text-sm">
                  {label}
                </a>
              ))}
            </div>
            <button className="px-5 py-2 bg-glass border border-purple-500/30 hover:border-purple-400/60 text-white rounded-xl font-medium text-sm transition-all duration-300">
              Get Started
            </button>
          </div>
        </nav>
        {children}
        <footer className="bg-glass border-t border-white/10 mt-12">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <a href="/" className="font-heading font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                DuoSeek
              </a>
              <nav className="flex flex-wrap items-center gap-6">
                {[
                  { label: "How it Works", href: "/how-it-works" },
                  { label: "FAQ", href: "/faq" },
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                  { label: "Contact", href: "mailto:hello@duoseek.gg" },
                ].map(({ label, href }) => (
                  <a key={href} href={href} className="text-zinc-400 hover:text-white text-sm transition-colors">
                    {label}
                  </a>
                ))}
              </nav>
              <p className="text-zinc-600 text-xs">© 2026 DuoSeek. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
