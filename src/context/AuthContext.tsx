import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/types";
import { supabase } from "@/lib/supabase";
import { config, backendMode } from "@/lib/config";

/**
 * Auth context.
 *
 * Email + password only (PRD §12.1). No OAuth, no forgot-password. Two
 * interchangeable engines:
 *  - Supabase Auth (when configured)
 *  - Local fallback (localStorage "users") so the app is fully demoable without
 *    any backend setup.
 *
 * The local fallback is intentionally simple but mirrors the Supabase surface
 * (signUp / signIn / signOut / session restore) so the UI never branches.
 */

interface AuthResult {
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  mode: "supabase" | "local";
  signUp: (params: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<AuthResult>;
  signIn: (params: { email: string; password: string }) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_USERS_KEY = "specguard.users.v1";
const LOCAL_SESSION_KEY = "specguard.session.v1";

type LocalUser = AuthUser & { password: string };

function readLocalUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalUser[]) : [];
  } catch {
    return [];
  }
}
function writeLocalUsers(users: LocalUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      if (config.supabaseEnabled && supabase) {
        const { data } = await supabase.auth.getSession();
        if (active && data.session?.user) {
          setUser(toAuthUser(data.session.user));
        }
        supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ? toAuthUser(session.user) : null);
        });
      } else {
        try {
          const raw = localStorage.getItem(LOCAL_SESSION_KEY);
          if (raw && active) setUser(JSON.parse(raw) as AuthUser);
        } catch {
          /* ignore */
        }
      }
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(
    async ({ email, password, fullName }) => {
      email = email.trim().toLowerCase();
      if (!isValidEmail(email)) return { error: "Please enter a valid email address." };
      if (password.length < 6)
        return { error: "Password must be at least 6 characters." };

      if (config.supabaseEnabled && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName ?? "" } },
        });
        if (error) return { error: friendlyAuthError(error.message) };
        if (data.session?.user) setUser(toAuthUser(data.session.user));
        return {};
      }

      // Local fallback
      const users = readLocalUsers();
      if (users.some((u) => u.email === email))
        return { error: "An account with this email already exists." };
      const newUser: LocalUser = {
        id: `local-${Date.now()}`,
        email,
        fullName: fullName?.trim() || undefined,
        password,
      };
      users.push(newUser);
      writeLocalUsers(users);
      const session: AuthUser = { id: newUser.id, email, fullName: newUser.fullName };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return {};
    },
    [],
  );

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async ({ email, password }) => {
      email = email.trim().toLowerCase();
      if (!isValidEmail(email)) return { error: "Please enter a valid email address." };

      if (config.supabaseEnabled && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { error: friendlyAuthError(error.message) };
        if (data.session?.user) setUser(toAuthUser(data.session.user));
        return {};
      }

      // Local fallback
      const users = readLocalUsers();
      const found = users.find((u) => u.email === email);
      if (!found || found.password !== password)
        return { error: "Invalid email or password." };
      const session: AuthUser = {
        id: found.id,
        email: found.email,
        fullName: found.fullName,
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return {};
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (config.supabaseEnabled && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      mode: backendMode as "supabase" | "local",
      signUp,
      signIn,
      signOut,
    }),
    [user, loading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ---- helpers ----

function toAuthUser(u: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  return {
    id: u.id,
    email: u.email ?? "",
    fullName: (u.user_metadata?.full_name as string) ?? undefined,
  };
}

function friendlyAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Invalid email or password.";
  if (m.includes("already registered") || m.includes("already in use"))
    return "An account with this email already exists.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment.";
  if (m.includes("email")) return "Please check your email and try again.";
  return msg;
}
