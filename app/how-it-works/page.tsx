"use client";

import { UserPlus, Video, Zap, MessageCircle } from "lucide-react";
import StepCard from "@/components/StepCard";

const steps = [
  {
    step: 1,
    title: "Create Your ID",
    description: "Connect your Discord, Riot ID, and Steam profile. We verify your accounts instantly, so every player on DuoSeek is authentic—no fake ranks, no anonymous trolls.",
    icon: UserPlus,
    direction: "left" as const,
  },
  {
    step: 2,
    title: "Upload Your Skills",
    description: "Showcase your best gameplay reels. Upload clips from your greatest clutches, your smoothest rotations, or your highest-rated sessions. Let your skills do the talking.",
    icon: Video,
    direction: "right" as const,
  },
  {
    step: 3,
    title: "The Shuffle",
    description: "Hit the Shuffle button and our algorithm goes to work. It analyzes your rank, preferred games, schedule, and play-style to find a compatible duo—in under a second.",
    icon: Zap,
    direction: "left" as const,
  },
  {
    step: 4,
    title: "Connect & Play",
    description: "Your match opens a shared voice channel and party lobby instantly. No awkward DMs, no lengthy profiles to read. Just jump in and play with your new duo.",
    icon: MessageCircle,
    direction: "right" as const,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-zinc-950 to-cyan-950/10 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">The Process</span>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mt-3 mb-6">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              DuoSeek
            </span>{" "}
            Works
          </h1>
          <p className="text-zinc-400 text-lg leading-[1.618] max-w-2xl mx-auto">
            From zero to queuing with your perfect duo—it takes less than two minutes. Here&apos;s the exact journey.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 opacity-30 transform -translate-x-1/2 hidden md:block" />
          <div className="space-y-16">
            {steps.map((step) => (
              <StepCard key={step.step} {...step} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
