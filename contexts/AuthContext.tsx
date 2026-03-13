"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService, AuthUser } from "@/lib/services/auth";
import { userService } from "@/lib/services/user";
import { clearOnboardingCookie } from "@/lib/onbCookie";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean; // true while the initial /auth/self check is in-flight
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .self()
      .then(async (u) => {
        // Fetch profile in parallel to get the signed avatarUrl
        const profile = await userService.getMe().catch(() => null);
        setUser({ ...u, avatarUrl: profile?.avatarUrl ?? u.avatarUrl ?? null });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    clearOnboardingCookie();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
