"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getAuthCallbackUrl } from "@/lib/auth/config";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthProvider";
import GamerAvatar from "@/components/GamerAvatar";

export default function AuthNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, profile, loading, openAuthOverlay, signOut, showToast } = useAuthOverlay();

  if (!hasSupabaseEnv()) {
    return (
      <Link
        href="/"
        className="px-5 py-2 bg-glass border border-white/20 text-zinc-300 rounded-xl font-medium text-sm transition-all duration-300"
      >
        Configure Auth
      </Link>
    );
  }

  const handleConnectProvider = async (provider: "google" | "discord") => {
    try {
      const supabase = createClient();
      const currentPath = pathname + (searchParams.size ? `?${searchParams.toString()}` : "");
      const callbackUrl = getAuthCallbackUrl();
      const redirectTo = `${callbackUrl}?next=${encodeURIComponent(currentPath)}&intent=generic`;
      const authAction = user
        ? supabase.auth.linkIdentity({
            provider,
            options: { redirectTo },
          })
        : supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo },
          });

      const { error } = await authAction;
      if (error) {
        const label = provider === "discord" ? "Discord" : "Google";
        showToast({ title: `${label} connect failed`, description: error.message, variant: "error" });
      }
    } catch {
      const title = provider === "discord" ? "Discord connect canceled" : "Google connect canceled";
      showToast({ title, description: "No changes were made.", variant: "info" });
    }
  };

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuthOverlay("generic")}
        className="px-5 py-2 bg-glass border border-purple-500/30 hover:border-purple-400/60 text-white rounded-xl font-medium text-sm transition-all duration-300"
      >
        {loading ? "Loading..." : "Sign In"}
      </button>
    );
  }

  const metadata = user.user_metadata as { full_name?: string } | undefined;
  const providers = (user.app_metadata?.providers as string[] | undefined) ?? [];
  const hasDiscord = providers.includes("discord");
  const hasGoogle = providers.includes("google");
  const handleText = profile?.gamer_handle ? `@${profile.gamer_handle}` : `@${user.email?.split("@")[0] || "player"}`;
  const avatarUrl = profile?.avatar_url || null;
  const initials = (profile?.gamer_handle || metadata?.full_name || "P").slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {!hasGoogle && (
        <button
          type="button"
          onClick={() => void handleConnectProvider("google")}
          className="hidden xl:inline px-3 py-1.5 rounded-lg border border-emerald-400/35 bg-emerald-900/20 text-emerald-200 text-xs"
        >
          Connect Google
        </button>
      )}
      {!hasDiscord && (
        <button
          type="button"
          onClick={() => void handleConnectProvider("discord")}
          className="hidden xl:inline px-3 py-1.5 rounded-lg border border-amber-400/35 bg-amber-900/20 text-amber-200 text-xs"
        >
          Connect Discord to unlock benefits
        </button>
      )}
      <GamerAvatar avatarUrl={avatarUrl} seedText={initials} alt="User avatar" sizeClassName="h-9 w-9" />
      <span className="hidden md:inline text-zinc-300 text-sm max-w-40 truncate">{handleText}</span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="px-5 py-2 bg-glass border border-cyan-500/30 hover:border-cyan-400/60 text-white rounded-xl font-medium text-sm transition-all duration-300"
      >
        Sign Out
      </button>
    </div>
  );
}
