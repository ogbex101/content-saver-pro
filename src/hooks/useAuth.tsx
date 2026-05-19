import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminChecked, setAdminChecked] = useState<string | null>(null);

  const checkAdmin = async (userId: string) => {
    // Don't re-check if we already checked this user
    if (adminChecked === userId) return;
    try {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      setIsAdmin(!!data);
      setAdminChecked(userId);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // ONLY use onAuthStateChange — do NOT also call getSession
    // Both firing causes a token refresh storm (429 rate limits)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      if (!mounted) return;
      
      setSession(sess);
      setUser(sess?.user ?? null);
      
      if (sess?.user) {
        // Use setTimeout to prevent Supabase client deadlock
        setTimeout(() => {
          if (mounted) checkAdmin(sess.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setAdminChecked(null);
      }
      setLoading(false);
    });

    // Safety timeout — never stay loading forever
    const timeout = setTimeout(() => {
      if (mounted && loading) setLoading(false);
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore signout errors
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAdminChecked(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
