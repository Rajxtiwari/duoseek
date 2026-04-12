"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import GlassContainer from "./GlassContainer";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  direction?: "left" | "right";
}

export default function StepCard({ step, title, description, icon: Icon, direction = "left" }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className={`flex items-start gap-6 ${direction === "right" ? "flex-row-reverse" : ""} max-w-lg ${direction === "right" ? "ml-auto" : ""}`}
    >
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-heading font-bold text-white text-lg shadow-lg">
          {step}
        </div>
      </div>
      <GlassContainer className="p-6 flex-1 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Icon size={22} className="text-purple-400" />
          <h3 className="font-heading text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-zinc-400 leading-[1.618]">{description}</p>
      </GlassContainer>
    </motion.div>
  );
}
