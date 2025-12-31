"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/apiClient";

type User = {
  id: number;
  username: string;
  email: string;
  is_premium: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * 🔁 Fetch authenticated user (COOKIE-BASED JWT)
   * - Relies on axios interceptor for refresh
   * - Safe to call after login / page reload
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/users/profile/");
      console.log(res.data);
      setUser(res.data.user);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        // Not authenticated — do NOT redirect automatically
        setUser(null);
      } else {
        console.error("Failed to refresh user:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🚪 Logout
   * - Clears cookies server-side
   * - Resets local auth state
   */
  const logout = useCallback(async () => {
    try {
      await api.post("/users/auth/logout/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  /**
   * 🔥 Initial auth check (ONCE)
   * - Runs on first load
   * - Relies on refresh cookie if access expired
   */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * ✨ Listen for login events (local + Google)
   * Allows Navbar to update instantly after login
   */
  useEffect(() => {
    const handler = () => refreshUser();
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 🔒 Safe hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
