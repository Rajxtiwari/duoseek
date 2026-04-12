"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import GlassContainer from "./GlassContainer";
import { Shield, Star } from "lucide-react";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

interface GamerCardProps {
  username?: string;
  game?: string;
  rank?: string;
  winRate?: string;
}

export default function GamerCard({
  username = "ViperMain_99",
  game = "Valorant",
  rank = "Diamond II",
  winRate = "67%",
}: GamerCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { requireAuth } = useAuthOverlay();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer"
    >
      <GlassContainer
        className={`p-6 w-64 transition-all duration-300 ${
          isHovered ? "neon-glow-purple border-purple-400/40" : "border border-white/10"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
            ✓ Match Found!
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={12} fill="currentColor" />
            <span className="text-xs">4.8</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-lg text-white relative">
            VM
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-950" />
          </div>
          <div>
            <p className="font-heading font-bold text-white text-lg">{username}</p>
            <p className="text-zinc-400 text-sm">{game}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Rank", value: rank },
            { label: "Win Rate", value: winRate },
          ].map(({ label, value }) => (
            <div key={label} className="bg-glass rounded-lg p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">{label}</p>
              <p className="font-heading font-semibold text-white text-sm">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Shield size={14} className="text-cyan-400" />
          <span className="text-xs text-zinc-400">Verified Riot ID</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => requireAuth("connect")}
            className="py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 font-heading font-semibold text-sm text-white transition-all hover:shadow-[0_0_18px_rgba(168,85,247,0.45)]"
          >
            Connect
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => requireAuth("chat")}
            className="py-2.5 rounded-xl border border-white/20 bg-zinc-900/60 font-heading font-semibold text-sm text-white transition-all hover:shadow-[0_0_18px_rgba(34,211,238,0.35)]"
          >
            Chat
          </motion.button>
        </div>
      </GlassContainer>
    </motion.div>
  );
}
