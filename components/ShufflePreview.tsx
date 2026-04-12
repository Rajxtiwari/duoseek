"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Shuffle } from "lucide-react";
import { useAuthOverlay } from "@/components/auth/AuthProvider";
import GlassContainer from "./GlassContainer";
import GamerCard from "./GamerCard";

export default function ShufflePreview() {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "matched">("idle");
  const searchParams = useSearchParams();
  const { requireAuth } = useAuthOverlay();

  const runShuffle = useCallback(() => {
    if (phase !== "idle") {
      setPhase("idle");
      return;
    }
    setPhase("shuffling");
    setTimeout(() => setPhase("matched"), 1500);
  }, [phase]);

  const handleShuffle = () => {
    requireAuth("shuffle", runShuffle);
  };

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<{ intent?: string }>;
      if (customEvent.detail?.intent === "shuffle") {
        runShuffle();
      }
    };

    window.addEventListener("duoseek:resume-intent", listener);
    return () => {
      window.removeEventListener("duoseek:resume-intent", listener);
    };
  }, [runShuffle]);

  useEffect(() => {
    if (searchParams.get("autostart") === "1") {
      queueMicrotask(() => {
        runShuffle();
      });
    }
  }, [runShuffle, searchParams]);

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Live Demo</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Shuffle Arena
            </span>
          </h2>
          <p className="text-zinc-400 text-lg leading-[1.618] mb-12 max-w-2xl mx-auto">
            One click. Thousands of verified gamers. Your perfect duo, found instantly.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-10">
          <motion.button
            onClick={handleShuffle}
            whileTap={{ scale: 0.98 }}
            className={`relative group px-12 py-5 rounded-2xl font-heading font-bold text-2xl tracking-wider text-white transition-all duration-300 ${
              phase === "matched"
                ? "bg-green-500/20 border border-green-500/40"
                : "bg-glass border border-purple-500/30 hover:border-purple-400/60"
            }`}
            style={{
              boxShadow:
                phase === "matched"
                  ? "0 0 30px rgba(34, 197, 94, 0.3)"
                  : phase === "shuffling"
                  ? "0 0 40px rgba(168, 85, 247, 0.6)"
                  : "0 0 20px rgba(168, 85, 247, 0.3)",
            }}
          >
            <span className="flex items-center gap-3">
              <motion.span
                animate={phase === "shuffling" ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, repeat: phase === "shuffling" ? Infinity : 0 }}
              >
                <Shuffle size={28} />
              </motion.span>
              {phase === "idle" && "PRESS TO SHUFFLE"}
              {phase === "shuffling" && "SHUFFLING..."}
              {phase === "matched" && "✓ MATCH FOUND! — Play Again?"}
            </span>
          </motion.button>

          <div className="relative h-80 w-full max-w-md flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} style={{ opacity: 1 - i * 0.25 }}>
                      <GlassContainer className="w-72 h-14 flex items-center gap-4 px-5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 rounded-full bg-zinc-700 w-28" />
                          <div className="h-1.5 rounded-full bg-zinc-800 w-16" />
                        </div>
                        <div className="h-2 rounded-full bg-zinc-700 w-12" />
                      </GlassContainer>
                    </motion.div>
                  ))}
                  <p className="text-zinc-500 text-sm mt-2">Press shuffle to find your duo</p>
                </motion.div>
              )}

              {phase === "shuffling" && (
                <motion.div
                  key="shuffling"
                  className="flex gap-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 20, -10, 0],
                        rotate: [0, 10, -10, 5, 0],
                        x: [0, (i - 1) * 15, -(i - 1) * 15, 0],
                      }}
                      transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                    >
                      <GlassContainer className="w-20 h-28 border border-purple-500/20 flex items-center justify-center">
                        <Shuffle size={20} className="text-purple-400" />
                      </GlassContainer>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {phase === "matched" && (
                <motion.div
                  key="matched"
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <GamerCard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
