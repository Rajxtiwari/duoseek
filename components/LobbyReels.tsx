"use client";

import { motion } from "framer-motion";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

const reels = [
  { title: "1v3 Retake", game: "Valorant", creator: "NovaRift" },
  { title: "Ace Clutch", game: "CS2", creator: "ArcRush" },
  { title: "Baron Steal", game: "LoL", creator: "EchoWing" },
];

export default function LobbyReels() {
  const { requireAuth } = useAuthOverlay();

  return (
    <section className="rounded-2xl border border-white/10 bg-glass p-6 md:p-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Reel Feed</h2>
          <p className="text-zinc-400 text-sm">Read-only for guests. Posting requires authentication.</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => requireAuth("post")}
          className="rounded-xl border border-cyan-400/35 bg-cyan-900/30 px-4 py-2 text-sm text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-shadow"
        >
          Post Reel
        </motion.button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reels.map((reel) => (
          <div key={reel.title} className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
            <div className="h-28 rounded-lg bg-gradient-to-br from-purple-900/60 to-cyan-900/50 border border-white/10" />
            <p className="mt-3 text-white font-medium">{reel.title}</p>
            <p className="text-zinc-400 text-xs mt-1">{reel.game} • {reel.creator}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
