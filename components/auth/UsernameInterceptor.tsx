"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

type HandleStatus = "idle" | "checking" | "available" | "taken";

type UsernameInterceptorProps = {
  isOpen: boolean;
};

export default function UsernameInterceptor({ isOpen }: UsernameInterceptorProps) {
  const { user, refreshProfile, showToast } = useAuthOverlay();
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<HandleStatus>("idle");
  const [saving, setSaving] = useState(false);
  const DRAFT_KEY = "duoseek.handle.draft";

  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setHandle("");
        setStatus("idle");
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (!draft) return;
      queueMicrotask(() => setHandle(draft));
    } catch {
      // Ignore storage issues.
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      if (handle.trim()) {
        localStorage.setItem(DRAFT_KEY, handle);
      }
    } catch {
      // Ignore storage issues.
    }
  }, [handle]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const cleanHandle = handle.trim();
    if (cleanHandle.length < 3) {
      queueMicrotask(() => setStatus("idle"));
      return;
    }

    let ignore = false;
    const timer = setTimeout(async () => {
      setStatus("checking");
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("gamer_handle", cleanHandle)
        .limit(1);

      if (ignore) {
        return;
      }

      if (error) {
        setStatus("idle");
        return;
      }

      const takenByOther = Boolean(data?.[0] && data[0].id !== user?.id);
      setStatus(takenByOther ? "taken" : "available");
    }, 280);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [handle, isOpen, user?.id]);

  const saveHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    const cleanHandle = handle.trim();
    if (cleanHandle.length < 3) {
      showToast({ title: "Handle too short", description: "Use at least 3 characters.", variant: "error" });
      return;
    }

    if (status === "taken") {
      showToast({ title: "Handle unavailable", description: "That handle is already taken.", variant: "error" });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const metadata = user.user_metadata as { avatar_url?: string } | undefined;
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          gamer_handle: cleanHandle,
          avatar_url: metadata?.avatar_url || null,
        },
        { onConflict: "id" },
      );

    if (error) {
      showToast({
        title: "Handle save failed",
        description: error.message.includes("duplicate") ? "That handle is already taken." : error.message,
        variant: "error",
      });
      setSaving(false);
      return;
    }

    await supabase.auth.updateUser({
      data: {
        gamer_handle: cleanHandle,
      },
    });

    await refreshProfile();
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore storage issues.
    }
    showToast({ title: "Identity complete", description: "Your gamer handle is saved.", variant: "success" });
    setSaving(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[95] bg-black/55 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 36, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-lg rounded-2xl border border-cyan-400/25 bg-glass p-6 md:p-8 shadow-[0_0_35px_rgba(34,211,238,0.25)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Username Interceptor</p>
            <h2 className="font-heading text-3xl text-white font-bold mt-2">Claim Your Gamer Handle</h2>
            <p className="text-zinc-400 mt-2">
              One quick step before entering lobby matchmaking. Your handle appears as @username across DuoSeek.
            </p>

            <form className="mt-6 space-y-4" onSubmit={saveHandle}>
              <input
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="NightClutch_007"
                minLength={3}
                maxLength={24}
                required
                className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
              />
              <p
                className={`text-xs ${
                  status === "available" ? "text-emerald-300" : status === "taken" ? "text-amber-300" : "text-zinc-500"
                }`}
              >
                {status === "checking" && "Checking availability..."}
                {status === "available" && "Handle available."}
                {status === "taken" && "Handle already taken."}
                {status === "idle" && "At least 3 characters."}
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving || status === "checking" || status === "taken"}
                className="w-full rounded-xl border border-purple-400/40 bg-purple-900/30 px-4 py-3 text-white hover:shadow-[0_0_22px_rgba(168,85,247,0.35)] transition-shadow disabled:opacity-60"
              >
                {saving ? "Saving..." : "Continue"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
