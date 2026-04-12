"use client";

import {
  createContext,
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

type AuthOverlayIntent = "shuffle" | "connect" | "chat" | "post" | "generic";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isOverlayOpen: boolean;
  overlayIntent: AuthOverlayIntent;
  nextPath: string;
  openAuthOverlay: (intent?: AuthOverlayIntent, requestedPath?: string) => void;
  closeAuthOverlay: () => void;
  requireAuth: (intent: AuthOverlayIntent, onAllowed?: () => void) => boolean;
  setUserAfterAuth: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(hasSupabaseEnv());
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayIntent, setOverlayIntent] = useState<AuthOverlayIntent>("generic");
  const [nextPath, setNextPath] = useState("/");

  const openAuthOverlay = useCallback(
    (intent: AuthOverlayIntent = "generic", requestedPath?: string) => {
      setOverlayIntent(intent);
      setNextPath(requestedPath ?? pathname ?? "/");
      setIsOverlayOpen(true);
    },
    [pathname],
  );

  const closeAuthOverlay = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

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

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const shouldOpen = searchParams.get("auth") === "1";
    if (!shouldOpen) {
      return;
    }

    const requestedNext = searchParams.get("next");
    const safeNext = requestedNext && requestedNext.startsWith("/") ? requestedNext : pathname ?? "/";
    queueMicrotask(() => {
      setOverlayIntent("generic");
      setNextPath(safeNext);
      setIsOverlayOpen(true);
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    params.delete("next");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isOverlayOpen,
      overlayIntent,
      nextPath,
      openAuthOverlay,
      closeAuthOverlay,
      requireAuth,
      setUserAfterAuth: setUser,
    }),
    [closeAuthOverlay, isOverlayOpen, loading, nextPath, openAuthOverlay, overlayIntent, requireAuth, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthOverlay />
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
