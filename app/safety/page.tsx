"use client";

import { ShieldCheck, EyeOff, AlertTriangle, Lock, Users, Zap } from "lucide-react";
import GlassContainer from "@/components/GlassContainer";
import SafetyTip from "@/components/SafetyTip";

const safetyTips = [
  {
    icon: ShieldCheck,
    title: "Data Privacy",
    description: "Game IDs are stored encrypted at rest using AES-256. We never store your account passwords—only OAuth tokens scoped to read-only game data.",
  },
  {
    icon: EyeOff,
    title: "Blocking & Reporting",
    description: "One tap blocks a player permanently from your match pool. Reports are reviewed within 24 hours. Three validated reports trigger an automatic suspension.",
  },
  {
    icon: Lock,
    title: "Account Security",
    description: "Enable Discord 2FA to protect your DuoSeek login. We send login alerts for new devices and support security keys (FIDO2/WebAuthn).",
  },
  {
    icon: AlertTriangle,
    title: "Toxic Behavior",
    description: "Harassment, slurs, and smurfing result in instant bans. Our ML classifier scans voice transcripts (opt-in) to flag repeated offenders.",
  },
  {
    icon: Users,
    title: "Community Standards",
    description: "Every verified player has signed our Gamer Code. Consistent 5-star ratings unlock a 'Trusted Duo' badge visible on your profile.",
  },
  {
    icon: Zap,
    title: "Instant Safeguards",
    description: "If you feel unsafe during a session, hit the Emergency Stop button to instantly end all connections and notify our safety team.",
  },
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-6 md:px-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/15 via-zinc-950 to-transparent pointer-events-none" />
      <div className="absolute top-40 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Safety Center</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            Your Safety is Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Priority
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-[1.618] max-w-2xl mx-auto">
            DuoSeek is built with safety at every layer—from verified identities to real-time moderation. Here&apos;s how we protect you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {safetyTips.map((tip, i) => (
            <SafetyTip key={tip.title} {...tip} index={i} />
          ))}
        </div>

        <GlassContainer dark className="p-8 md:p-12 mb-10 border border-cyan-500/10">
          <h2 className="font-heading text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <EyeOff size={26} className="text-cyan-400" />
            How to Block &amp; Report a Toxic Player
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "During Match", desc: "Tap the player's avatar in the session overlay." },
              { step: "2", title: "Open Menu", desc: "Select 'Block & Report' from the three-dot menu." },
              { step: "3", title: "Select Reason", desc: "Choose from: Harassment, Cheating, Smurfing, or Spam." },
              { step: "4", title: "Submit", desc: "The block is instant. Report goes to moderation queue." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-heading font-bold text-cyan-400 text-xl">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{title}</p>
                  <p className="text-sm text-zinc-400 leading-[1.618]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassContainer>

        <GlassContainer className="p-6 border border-cyan-500/20 text-center">
          <ShieldCheck size={32} className="text-cyan-400 mx-auto mb-3" />
          <h3 className="font-heading text-xl font-bold text-white mb-2">Need Urgent Help?</h3>
          <p className="text-zinc-400 mb-4 text-sm">
            Our safety team is available 24/7 for urgent reports.
          </p>
          <a
            href="mailto:safety@duoseek.gg"
            className="inline-block px-6 py-2.5 bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 rounded-xl font-medium text-sm hover:bg-cyan-500/25 transition-colors"
          >
            safety@duoseek.gg
          </a>
        </GlassContainer>
      </div>
    </div>
  );
}
