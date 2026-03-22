import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured, supabase, type AppUser } from "../services/supabase";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(
      (result: {
        data?: { session?: { user?: AppUser } | null };
        error?: { message?: string } | null;
      }) => {
      if (!active) return;

      if (result.error) {
        console.error("Failed to get auth session:", result.error);
      }

      setUser(result.data?.session?.user ?? null);
      setLoading(false);
      }
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: unknown, session: { user?: AppUser } | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    if (!supabase) {
      return { error: "Auth is not configured yet." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string) {
    if (!supabase) {
      return { error: "Auth is not configured yet." };
    }

    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    if (!supabase) {
      return { error: "Auth is not configured yet." };
    }

    const { error } = await supabase.auth.signOut();
    return { error: error?.message ?? null };
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
