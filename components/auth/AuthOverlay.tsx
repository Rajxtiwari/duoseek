"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth/config";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

type AuthMode = "login" | "signup";
const AUTH_DRAFT_KEY = "duoseek.auth.draft";

function getPasswordScore(password: string) {
  const hasMinLength = password.length >= 6;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return Number(hasMinLength) + Number(hasLetter) + Number(hasNumber);
}

function getStrengthLabel(score: number) {
  if (score <= 1) return "Weak";
  if (score === 2) return "Medium";
  return "Strong";
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v4h5.6c-.2 1.3-1.6 3.8-5.6 3.8-3.4 0-6.1-2.8-6.1-6.2s2.7-6.2 6.1-6.2c1.9 0 3.2.8 4 1.6l2.7-2.6C17 2.9 14.8 2 12 2 6.8 2 2.6 6.2 2.6 11.4S6.8 20.8 12 20.8c6.9 0 9.1-4.8 9.1-7.2 0-.5-.1-.9-.1-1.3H12z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M20.3 4.4A16.9 16.9 0 0 0 16 3a11.8 11.8 0 0 0-.5 1.1 15.5 15.5 0 0 0-7 0L8 3a16.9 16.9 0 0 0-4.3 1.4C1 8.3.4 12 .7 15.8a16.8 16.8 0 0 0 5.2 2.6c.4-.5.8-1.1 1.1-1.7-.6-.2-1.2-.5-1.7-.8l.4-.3a12.4 12.4 0 0 0 10.6 0l.4.3c-.5.3-1.1.6-1.7.8.3.6.7 1.2 1.1 1.7a16.8 16.8 0 0 0 5.2-2.6c.4-4.5-.7-8.2-2.9-11.4ZM9.4 13.8c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"
      />
    </svg>
  );
}

export default function AuthOverlay() {
  const { user, isOverlayOpen, closeAuthOverlay, nextPath, overlayIntent, pendingIntent, completeAuthFlow, setUserAfterAuth, showToast } = useAuthOverlay();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canUseSupabase = hasSupabaseEnv();
  const passwordScore = getPasswordScore(password);
  const canSubmitSignup = mode === "login" || passwordScore === 3;

  const onOAuth = async (provider: "google" | "discord") => {
    if (!canUseSupabase) {
      showToast({ title: "Auth not configured", description: "Supabase env is missing.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const intentParam = pendingIntent ? `&intent=${pendingIntent}` : "";
      const callbackUrl = getAuthCallbackUrl();
      const authAction = user
        ? supabase.auth.linkIdentity({
            provider,
            options: {
              redirectTo: `${callbackUrl}?next=${encodeURIComponent(nextPath)}${intentParam}`,
            },
          })
        : supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${callbackUrl}?next=${encodeURIComponent(nextPath)}${intentParam}`,
            },
          });

      const { error } = await authAction;

      if (error) {
        showToast({ title: "OAuth failed", description: error.message, variant: "error" });
        setLoading(false);
      }
    } catch {
      showToast({ title: "OAuth interrupted", description: "Please try again.", variant: "error" });
      setLoading(false);
    }
  };

  const onEmailPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canUseSupabase) {
      showToast({ title: "Auth not configured", description: "Supabase env is missing.", variant: "error" });
      return;
    }

    if (mode === "signup" && !canSubmitSignup) {
      showToast({
        title: "Weak password",
        description: "Use at least 6 characters with 1 letter and 1 number.",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast({ title: "Login failed", description: error.message, variant: "error" });
        setLoading(false);
        return;
      }

      const signedInUser = data.user ?? null;
      setUserAfterAuth(signedInUser);
      completeAuthFlow(signedInUser);
      showToast({ title: "Welcome back", description: "Logged in successfully.", variant: "success" });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      showToast({ title: "Signup failed", description: error.message, variant: "error" });
      setLoading(false);
      return;
    }

    if (!data.user || !data.session) {
      showToast({ title: "Verify your identity", description: "Check your inbox and verify your email.", variant: "info" });
      setLoading(false);
      return;
    }

    setUserAfterAuth(data.user);
    completeAuthFlow(data.user);
    showToast({ title: "Account ready", description: "Signup complete.", variant: "success" });
    setLoading(false);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { mode?: AuthMode; email?: string };
      queueMicrotask(() => {
        if (draft.mode === "login" || draft.mode === "signup") {
          setMode(draft.mode);
        }
        if (draft.email) {
          setEmail(draft.email);
        }
      });
    } catch {
      // Ignore malformed draft.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_DRAFT_KEY, JSON.stringify({ mode, email }));
    } catch {
      // Ignore storage write issues.
    }
  }, [email, mode]);

  useEffect(() => {
    if (!isOverlayOpen) {
      return;
    }

    queueMicrotask(() => {
      setPassword("");
    });
  }, [isOverlayOpen]);

  useEffect(() => {
    if (!isOverlayOpen || !user) {
      return;
    }

    completeAuthFlow(user);
  }, [completeAuthFlow, isOverlayOpen, user]);

  const panelTransition = useMemo(
    () => ({ type: "spring" as const, stiffness: 260, damping: 20 }),
    [],
  );

  const intentCopy =
    overlayIntent === "shuffle"
      ? "Sign in to start shuffling"
      : overlayIntent === "connect"
      ? "Sign in to connect with players"
      : overlayIntent === "chat"
      ? "Sign in to start chat"
      : overlayIntent === "post"
      ? "Sign in to post reels"
      : "Access DuoSeek";

  return (
    <AnimatePresence>
      {isOverlayOpen && (
        <motion.div
          className="fixed inset-0 z-[80] backdrop-blur-md bg-black/45 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthOverlay}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl border border-purple-400/30 bg-glass p-6 md:p-8 shadow-[0_0_45px_rgba(168,85,247,0.25)]"
            initial={{ y: 44, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 44, opacity: 0 }}
            transition={panelTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.18em] text-purple-300">Welcome Back</p>
              <h2 className="font-heading text-3xl text-white font-bold mt-2">{intentCopy}</h2>
            </div>

            <motion.div
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={panelTransition}
              className="space-y-4"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => void onOAuth("google")}
                disabled={loading}
                className="w-full rounded-xl border border-white/20 px-4 py-3 text-white flex items-center justify-center gap-2 hover:shadow-[0_0_22px_rgba(45,212,191,0.25)] transition-shadow"
              >
                <GoogleIcon />
                Continue with Google
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => void onOAuth("discord")}
                disabled={loading}
                className="w-full rounded-xl border border-purple-400/50 bg-purple-900/30 px-4 py-3 text-white flex items-center justify-center gap-2 hover:shadow-[0_0_22px_rgba(168,85,247,0.35)] transition-shadow"
              >
                <DiscordIcon />
                Continue with Discord
              </motion.button>

              {!user && (
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Using different emails for Google and Discord? Sign in with your existing DuoSeek account first, then use the top-right Connect buttons to link providers.
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <div className="h-px bg-white/10 flex-1" />
                <span>Email + Password</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={onEmailPassword} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                />
                {mode === "signup" && (
                  <div className="space-y-2">
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          passwordScore === 3 ? "bg-emerald-400" : passwordScore === 2 ? "bg-amber-400" : "bg-rose-400"
                        }`}
                        style={{ width: `${(passwordScore / 3) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-400">
                      Password strength: {getStrengthLabel(passwordScore)}. Use 6+ chars, 1 letter, 1 number.
                    </p>
                  </div>
                )}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !canSubmitSignup}
                  className="w-full rounded-xl border border-cyan-400/40 bg-cyan-900/30 px-4 py-3 text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-shadow"
                >
                  {loading ? "Securing access..." : mode === "login" ? "Login" : "Create Account"}
                </motion.button>
              </form>

              <button
                type="button"
                onClick={() => setMode((current) => (current === "login" ? "signup" : "login"))}
                className="text-sm text-zinc-300 hover:text-white"
              >
                {mode === "login" ? "Need an account? Switch to Signup" : "Have an account? Switch to Login"}
              </button>
            </motion.div>

            {!canUseSupabase && <p className="mt-4 text-sm text-amber-300">Set Supabase env vars to enable auth.</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
