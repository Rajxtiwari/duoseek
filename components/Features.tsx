"use client";

import { motion } from "framer-motion";
import { Gamepad2, Clapperboard, Shuffle } from "lucide-react";
import GlassContainer from "./GlassContainer";

const features = [
  {
    icon: Gamepad2,
    iconColor: "text-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.15)",
    borderColor: "border-cyan-500/20 hover:border-cyan-400/40",
    title: "Identity",
    subtitle: "Verified. Trusted. Ranked.",
    description:
      "Link your Riot ID or Steam profile for instant verification. Your rank, history, and play style are visible—no catfishing, just real gamers.",
    tags: ["Riot ID", "Steam", "Verified Rank"],
    tagStyle: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    icon: Clapperboard,
    iconColor: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.15)",
    borderColor: "border-purple-500/20 hover:border-purple-400/40",
    title: "Clips",
    subtitle: "Show Don't Tell.",
    description:
      "Upload your best gameplay reels. Let your skills speak before you queue. Highlight your clutches, your coordination, your style.",
    tags: ["Gameplay Reels", "Highlights", "Skills"],
    tagStyle: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  {
    icon: Shuffle,
    iconColor: "text-transparent",
    glowColor: "rgba(168, 85, 247, 0.1)",
    borderColor: "border-purple-500/20 hover:border-cyan-400/40",
    title: "Shuffle",
    subtitle: "Instant. Random. Electric.",
    description:
      "Hit Shuffle and our algorithm matches you with a compatible duo in under a second. Jump straight into the lobby—no DMs needed.",
    tags: ["Instant Match", "Algorithm", "VC Ready"],
    tagStyle: "bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 text-purple-300",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 md:px-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">The Three Pillars</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Find Your Duo
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <GlassContainer
                className={`p-8 h-full flex flex-col gap-5 border transition-all duration-300 cursor-default ${feature.borderColor}`}
                style={{ boxShadow: `0 0 40px ${feature.glowColor}` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: feature.glowColor, border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <feature.icon
                    size={26}
                    className={feature.title === "Shuffle" ? "" : feature.iconColor}
                    style={
                      feature.title === "Shuffle"
                        ? { stroke: "url(#shuffleGrad)" }
                        : undefined
                    }
                  />
                  {feature.title === "Shuffle" && (
                    <svg width={0} height={0}>
                      <defs>
                        <linearGradient id="shuffleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>

                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 mt-0.5">{feature.subtitle}</p>
                </div>

                <p className="text-zinc-400 leading-[1.618] flex-1">{feature.description}</p>

                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2.5 py-1 rounded-full border ${feature.tagStyle}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
