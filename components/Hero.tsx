"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthOverlay } from "@/components/auth/AuthProvider";
import GlassContainer from "./GlassContainer";

export default function Hero() {
  const router = useRouter();
  const { requireAuth } = useAuthOverlay();

  const onShuffleClick = () => {
    requireAuth("shuffle", () => {
      router.push("/shuffle");
    });
  };

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 px-6 md:px-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-zinc-950 to-cyan-950/20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Left: Text & CTA */}
        <div className="flex-[1.618] space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 bg-glass rounded-full text-sm text-purple-400 font-medium mb-6 border border-purple-500/20">
              🎮 Gaming Matchmaking, Reimagined
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight text-white">
              Stop Queuing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Alone.
              </span>
              <br />
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Match.
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-zinc-400 text-lg md:text-xl leading-[1.618] max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            DuoSeek connects verified gamers through smart random matchmaking. Share your gameplay reels, link your Riot ID or Steam, and find your perfect duo in seconds.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onShuffleClick}
              className="group relative px-8 py-4 bg-glass rounded-xl font-heading font-semibold text-lg text-white transition-all duration-300 hover:neon-glow-purple border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-900/30"
            >
              <span className="relative z-10">Start Shuffling →</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-cyan-600/0 group-hover:from-purple-600/20 group-hover:to-cyan-600/20 transition-all duration-300" />
            </button>
            <button className="px-8 py-4 bg-glass rounded-xl font-heading font-semibold text-lg text-zinc-300 border border-white/10 hover:border-white/20 transition-all duration-300">
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-6 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex -space-x-3">
              {["VP", "SK", "AB", "MX"].map((initials, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold border-2 border-zinc-950"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-zinc-400 text-sm">
              <span className="text-white font-semibold">2,400+</span> gamers already matched
            </p>
          </motion.div>
        </div>

        {/* Right: Visual */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {[2, 1, 0].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  transform: `rotate(${(i - 1) * 8}deg) translateY(${i * 8}px) translateX(${(i - 1) * 12}px)`,
                  zIndex: 3 - i,
                }}
                animate={{
                  rotate: [(i - 1) * 8, (i - 1) * 8 + 2, (i - 1) * 8],
                }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <GlassContainer className={`w-56 h-72 p-5 flex flex-col gap-3 ${i === 0 ? "neon-glow-purple" : ""}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
                    {["VP", "SK", "AB"][i]}
                  </div>
                  <div className="space-y-1.5">
                    <div className={`h-2.5 rounded-full bg-gradient-to-r ${i === 0 ? "from-purple-500 to-cyan-500" : "from-zinc-600 to-zinc-700"} ${i === 0 ? "w-32" : "w-24"}`} />
                    <div className="h-2 rounded-full bg-zinc-700 w-20" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {["Val", "CS2", "LoL"].map((tag, j) => (
                      <span key={j} className={`text-xs px-2 py-0.5 rounded-full bg-glass border ${j === 0 ? "border-purple-500/40 text-purple-300" : "border-white/10 text-zinc-400"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        style={{ width: `${[75, 45, 60][i]}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Rank: {["Diamond 2", "Gold 1", "Plat 3"][i]}</p>
                  </div>
                </GlassContainer>
              </motion.div>
            ))}
            <div className="w-56 h-72 opacity-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
