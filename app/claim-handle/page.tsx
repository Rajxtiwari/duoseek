"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

type HandleStatus = "idle" | "checking" | "available" | "taken";

export default function ClaimHandlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, openAuthOverlay } = useAuthOverlay();
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<HandleStatus>("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nextPath = searchParams.get("next")?.startsWith("/") ? (searchParams.get("next") as string) : "/";

  useEffect(() => {
    if (!user) {
      openAuthOverlay("generic", "/claim-handle");
    }
  }, [openAuthOverlay, user]);

  useEffect(() => {
    const cleanHandle = handle.trim();
    if (cleanHandle.length < 3) {
      queueMicrotask(() => setStatus("idle"));
      return;
    }

    let ignore = false;
    const timeout = setTimeout(async () => {
      setStatus("checking");
      const supabase = createClient();
      const { data, error } = await supabase.from("profiles").select("id").eq("gamer_handle", cleanHandle).limit(1);
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
      clearTimeout(timeout);
    };
  }, [handle, user?.id]);

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      openAuthOverlay("generic", "/claim-handle");
      return;
    }

    const cleanHandle = handle.trim();
    if (cleanHandle.length < 3) {
      setMessage("Handle must be at least 3 characters.");
      return;
    }

    if (status === "taken") {
      setMessage("Handle already taken.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    const supabase = createClient();

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, gamer_handle: cleanHandle }, { onConflict: "id" });

    if (profileError) {
      setMessage(profileError.message.includes("duplicate") ? "Handle already taken." : profileError.message);
      setSubmitting(false);
      return;
    }

    const { error: userError } = await supabase.auth.updateUser({
      data: {
        gamer_handle: cleanHandle,
      },
    });

    if (userError) {
      setMessage(userError.message);
      setSubmitting(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-12 flex items-center justify-center">
      <section className="max-w-xl w-full rounded-2xl border border-white/10 bg-glass p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Identity Handshake</p>
        <h1 className="font-heading text-4xl font-bold text-white mt-2">Claim Your Gamer Handle</h1>
        <p className="text-zinc-400 mt-3">
          Pick a unique DuoSeek username to enter the lobby. This is required once for every new account.
        </p>

        <form onSubmit={submitHandle} className="mt-6 space-y-4">
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="NightClutch_007"
            minLength={3}
            maxLength={24}
            required
            className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
          />
          <p className={`text-xs ${status === "available" ? "text-emerald-300" : status === "taken" ? "text-amber-300" : "text-zinc-500"}`}>
            {status === "checking" && "Checking availability..."}
            {status === "available" && "Handle available."}
            {status === "taken" && "That handle is already taken."}
            {status === "idle" && "At least 3 characters."}
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || status === "checking" || status === "taken"}
            className="w-full rounded-xl border border-purple-400/40 bg-purple-900/30 px-4 py-3 text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-shadow disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Continue to Lobby"}
          </motion.button>
        </form>

        {message && <p className="mt-4 text-sm text-amber-300">{message}</p>}
      </section>
    </main>
  );
}
