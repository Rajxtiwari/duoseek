"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getAuthCallbackUrl } from "@/lib/auth/config";
import { getDiscordLinkErrorMessage, hasLinkedIdentity, isManualLinkingDisabledError } from "@/lib/auth/identity";
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

  const handleConnectDiscord = async () => {
    try {
      if (!user) {
        showToast({ title: "Sign in first", description: "Log in, then link your Discord account.", variant: "info" });
        return;
      }

      const supabase = createClient();
      const currentPath = pathname + (searchParams.size ? `?${searchParams.toString()}` : "");
      const callbackUrl = getAuthCallbackUrl();
      const redirectTo = `${callbackUrl}?next=${encodeURIComponent(currentPath)}&intent=generic`;
      const authAction = supabase.auth.linkIdentity({
        provider: "discord",
        options: { redirectTo },
      });

      const { error } = await authAction;
      if (error) {
        const manualLinkingDisabled = isManualLinkingDisabledError(error.message);
        showToast({
          title: manualLinkingDisabled ? "Discord linking unavailable" : "Discord connect failed",
          description: getDiscordLinkErrorMessage(error.message),
          variant: "error",
        });
        return;
      }

      showToast({ title: "Discord connected", description: "Your account now supports Discord login.", variant: "success" });
    } catch {
      showToast({ title: "Discord connect canceled", description: "No changes were made.", variant: "info" });
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
  const hasDiscord = hasLinkedIdentity(user, "discord");
  const handleText = profile?.gamer_handle ? `@${profile.gamer_handle}` : `@${user.email?.split("@")[0] || "player"}`;
  const avatarUrl = profile?.avatar_url || null;
  const initials = (profile?.gamer_handle || metadata?.full_name || "P").slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {!hasDiscord && (
        <button
          type="button"
          onClick={() => void handleConnectDiscord()}
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
