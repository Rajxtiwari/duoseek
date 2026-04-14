"use client";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ShufflePreview from "@/components/ShufflePreview";
import { useAuthOverlay } from "@/components/auth/AuthProvider";
import OnboardingDashboard from "@/components/dashboard/OnboardingDashboard";

export default function HomeExperience() {
  const { user, loading } = useAuthOverlay();

  if (loading) {
    return <main className="min-h-screen pt-24 px-6 md:px-12" />;
  }

  if (user) {
    return <OnboardingDashboard />;
  }

  return (
    <main>
      <Hero />
      <Features />
      <ShufflePreview />
    </main>
  );
}
