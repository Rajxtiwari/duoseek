"use client";

import {
  createContext,
  useRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import AuthOverlay from "@/components/auth/AuthOverlay";
import UsernameInterceptor from "@/components/auth/UsernameInterceptor";
import ToastHub, { type ToastItem } from "@/components/auth/ToastHub";

type AuthOverlayIntent = "shuffle" | "connect" | "chat" | "post" | "generic";

type GamerProfile = {
  id: string;
  gamer_handle: string | null;
  avatar_url: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: GamerProfile | null;
  loading: boolean;
  isOverlayOpen: boolean;
  overlayIntent: AuthOverlayIntent;
  pendingIntent: AuthOverlayIntent | null;
  nextPath: string;
  openAuthOverlay: (intent?: AuthOverlayIntent, requestedPath?: string) => void;
  closeAuthOverlay: () => void;
  requireAuth: (intent: AuthOverlayIntent, onAllowed?: () => void) => boolean;
  setUserAfterAuth: (user: User | null) => void;
  completeAuthFlow: (user: User | null) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  showToast: (toast: Omit<ToastItem, "id">) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<GamerProfile | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  const [loading, setLoading] = useState(hasSupabaseEnv());
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayIntent, setOverlayIntent] = useState<AuthOverlayIntent>("generic");
  const [pendingIntent, setPendingIntent] = useState<AuthOverlayIntent | null>(null);
  const [nextPath, setNextPath] = useState("/");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [needsAccountLinkHelp, setNeedsAccountLinkHelp] = useState(false);
  const profileRequestSeq = useRef(0);
  const accountLinkHelpShownForUser = useRef<string | null>(null);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, ...toast }]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const refreshProfileForUser = useCallback(async (targetUser: User | null) => {
    const requestId = ++profileRequestSeq.current;

    if (!targetUser || !hasSupabaseEnv()) {
      if (requestId === profileRequestSeq.current) {
        setProfile(null);
        setProfileChecked(Boolean(targetUser));
        setNeedsAccountLinkHelp(false);
      }
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,gamer_handle,avatar_url")
      .eq("id", targetUser.id)
      .maybeSingle();

    if (error) {
      if (requestId === profileRequestSeq.current) {
        setProfile(null);
        setProfileChecked(true);
        setNeedsAccountLinkHelp(false);
      }
      return;
    }

    const providerMetadata = targetUser.user_metadata as { avatar_url?: string } | undefined;
    const providerAvatarUrl = providerMetadata?.avatar_url || null;
    if (data && !data.avatar_url && providerAvatarUrl) {
      const { data: updatedData } = await supabase
        .from("profiles")
        .update({ avatar_url: providerAvatarUrl })
        .eq("id", targetUser.id)
        .select("id,gamer_handle,avatar_url")
        .maybeSingle();

      if (requestId === profileRequestSeq.current) {
        setProfile((updatedData as GamerProfile | null) ?? (data as GamerProfile));
        setProfileChecked(true);
        setNeedsAccountLinkHelp(false);
        try {
          localStorage.setItem("duoseek.primary_user_id", targetUser.id);
        } catch {
          // Ignore storage issues.
        }
      }
      return;
    }

    if (requestId === profileRequestSeq.current) {
      const resolvedProfile = (data as GamerProfile | null) ?? null;
      setProfile(resolvedProfile);
      setProfileChecked(true);

      if (resolvedProfile) {
        setNeedsAccountLinkHelp(false);
        try {
          localStorage.setItem("duoseek.primary_user_id", targetUser.id);
        } catch {
          // Ignore storage issues.
        }
        return;
      }

      let previousPrimaryUserId: string | null = null;
      try {
        previousPrimaryUserId = localStorage.getItem("duoseek.primary_user_id");
      } catch {
        // Ignore storage issues.
      }

      const needsLinkHelp = Boolean(previousPrimaryUserId && previousPrimaryUserId !== targetUser.id);
      setNeedsAccountLinkHelp(needsLinkHelp);

      if (needsLinkHelp && accountLinkHelpShownForUser.current !== targetUser.id) {
        accountLinkHelpShownForUser.current = targetUser.id;
        showToast({
          title: "Use account linking",
          description: "You signed in to a different provider account. Sign in with your original account, then use Connect Google/Discord.",
          variant: "info",
        });
      }
    }
  }, [showToast]);

  const refreshProfile = useCallback(async () => {
    await refreshProfileForUser(user);
  }, [refreshProfileForUser, user]);

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();
      const { error: localError } = await supabase.auth.signOut({ scope: "local" });
      if (localError) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
      setProfileChecked(false);
      setNeedsAccountLinkHelp(false);
      setIsOverlayOpen(false);
      setPendingIntent(null);
      showToast({ title: "Signed out", description: "You are now browsing as guest.", variant: "info" });
      router.push("/");
    } catch {
      showToast({ title: "Sign out failed", description: "Please try again.", variant: "error" });
    }
  }, [router, showToast]);

  const openAuthOverlay = useCallback(
    (intent: AuthOverlayIntent = "generic", requestedPath?: string) => {
      setOverlayIntent(intent);
      setPendingIntent(intent);
      setNextPath(requestedPath ?? pathname ?? "/");
      setIsOverlayOpen(true);
    },
    [pathname],
  );

  const closeAuthOverlay = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

  const completeAuthFlow = useCallback(
    (authenticatedUser: User | null) => {
      setUser(authenticatedUser);
      setIsOverlayOpen(false);

      const intentToResume = pendingIntent;
      setPendingIntent(null);

      if (intentToResume === "shuffle") {
        if (pathname === "/" || pathname.startsWith("/shuffle")) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("duoseek:resume-intent", { detail: { intent: "shuffle" } }));
          }
        } else {
          router.push("/shuffle?autostart=1");
          return;
        }
      }

      if (nextPath && nextPath !== pathname) {
        router.push(nextPath);
      }
    },
    [nextPath, pathname, pendingIntent, router],
  );

  const requireAuth = useCallback(
    (intent: AuthOverlayIntent, onAllowed?: () => void) => {
      if (user) {
        onAllowed?.();
        return true;
      }
      openAuthOverlay(intent, pathname ?? "/");
      return false;
    },
    [openAuthOverlay, pathname, user],
  );

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }

    const supabase = createClient();
    let active = true;

    const syncAuthState = (nextUser: User | null) => {
      if (!active) {
        return;
      }
      setUser(nextUser);
      void refreshProfileForUser(nextUser);
    };

    void supabase.auth
      .getUser()
      .then(({ data }) => {
        syncAuthState(data.user ?? null);
      })
      .catch(() => {
        syncAuthState(null);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAuthState(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [refreshProfileForUser]);

  useEffect(() => {
    const shouldOpen = searchParams.get("auth") === "1";
    if (!shouldOpen) {
      return;
    }

    const requestedNext = searchParams.get("next");
    const requestedIntent = searchParams.get("intent");
    const safeIntent: AuthOverlayIntent =
      requestedIntent === "shuffle" || requestedIntent === "connect" || requestedIntent === "chat" || requestedIntent === "post"
        ? requestedIntent
        : "generic";
    const safeNext = requestedNext && requestedNext.startsWith("/") ? requestedNext : pathname ?? "/";
    queueMicrotask(() => {
      setOverlayIntent(safeIntent);
      setPendingIntent(safeIntent);
      setNextPath(safeNext);
      setIsOverlayOpen(true);
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    params.delete("next");
    params.delete("intent");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isOverlayOpen,
      overlayIntent,
      pendingIntent,
      nextPath,
      openAuthOverlay,
      closeAuthOverlay,
      requireAuth,
      setUserAfterAuth: setUser,
      completeAuthFlow,
      refreshProfile,
      signOut,
      showToast,
    }),
    [closeAuthOverlay, completeAuthFlow, isOverlayOpen, loading, nextPath, openAuthOverlay, overlayIntent, pendingIntent, profile, refreshProfile, requireAuth, showToast, signOut, user],
  );

  const shouldInterceptHandle = Boolean(user && profileChecked && !profile?.gamer_handle && !needsAccountLinkHelp);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthOverlay />
      <UsernameInterceptor isOpen={shouldInterceptHandle} />
      {needsAccountLinkHelp && user && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[96] w-[min(92vw,720px)] rounded-2xl border border-amber-300/40 bg-zinc-900/90 px-4 py-3 text-sm text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.2)]">
          <p>
            This provider signed into a different account on this browser. If your Google and Discord emails are different, sign out, sign back into your original DuoSeek account, then use Connect Google/Connect Discord to link identities.
          </p>
        </div>
      )}
      <ToastHub toasts={toasts} onDismiss={dismissToast} />
    </AuthContext.Provider>
  );
}

export function useAuthOverlay() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthOverlay must be used within AuthProvider");
  }
  return context;
}
