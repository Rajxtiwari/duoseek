"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

export default function AuthNav() {
  const router = useRouter();
  const { user, loading, openAuthOverlay } = useAuthOverlay();

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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
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

  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:inline text-zinc-300 text-sm max-w-40 truncate">{user.email}</span>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="px-5 py-2 bg-glass border border-cyan-500/30 hover:border-cyan-400/60 text-white rounded-xl font-medium text-sm transition-all duration-300"
      >
        Sign Out
      </button>
    </div>
  );
}
