"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import GlassContainer from "./GlassContainer";

interface SafetyTipProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

export default function SafetyTip({ icon: Icon, title, description, index = 0 }: SafetyTipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassContainer
        className="p-6 h-full border border-cyan-500/15 hover:border-cyan-400/35 transition-all duration-300 group"
        style={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.05)" }}
      >
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
          <Icon size={24} className="text-cyan-400" />
        </div>
        <h3 className="font-heading text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm leading-[1.618]">{description}</p>
      </GlassContainer>
    </motion.div>
  );
}
