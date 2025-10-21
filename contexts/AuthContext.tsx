// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client"; // Your helper in /lib/supabase/client
import type { SupabaseClient, Session as SupaSession } from "@supabase/supabase-js";

type User = {
  id: string;
  email: string;
  name?: string;
  role?: "user" | "admin" | string;
  [key: string]: any;
};

type Session = {
  access_token: string;
  expires_at: number | null;
} | null;

type AuthContextType = {
  user: User | null;
  session: Session;
  setUser: (u: User | null) => void;
  setSession: (s: Session) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Create a fresh browser supabase client per session
  // createClient should use NEXT_PUBLIC_* env vars defined in your .env.local
  const supabase: SupabaseClient = createClient();

  // helper to set user by fetching profile row (if you store profile in users table)
  async function fetchProfileAndSetUser(supabaseUserId: string | null) {
    if (!supabaseUserId) {
      setUser(null);
      return;
    }
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUserId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
      } else if (profile) {
        // adapt this mapping to your users table columns
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name ?? profile.full_name ?? profile.email,
          role: profile.role ?? "user",
          ...profile,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("fetchProfileAndSetUser", err);
      setUser(null);
    }
  }

  // Initialize session + user on mount
  useEffect(() => {
    let mounted = true;
    async function init() {
      setIsLoading(true);
      try {
        // If you're using the new supabase auth in the browser, you might call:
        const { data } = await supabase.auth.getSession?.() /* optional chaining in case of different sdk */.catch(() => ({ data: { session: null } }));
        // For older/newer versions, you may need to adapt:
        // const { data: sessionData } = await supabase.auth.getSession();
        const currentSession: any = (data && (data.session ?? data)) || null;
        setSession(currentSession ? { access_token: currentSession.access_token, expires_at: currentSession.expires_at ?? null } : null);

        const supaUserId = currentSession?.user?.id ?? null;
        if (supaUserId) {
          await fetchProfileAndSetUser(supaUserId);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setSession(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    init();

    // listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession: SupaSession | null) => {
      try {
        if (newSession?.user) {
          setSession({ access_token: (newSession as any).access_token, expires_at: (newSession as any).expires_at ?? null });
          await fetchProfileAndSetUser(newSession.user.id);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error("onAuthStateChange handler error:", err);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // convenience login function (email/password)
  async function login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message || String(error) };
      }

      // If login succeeded, fetch profile row
      if (data?.user?.id) {
        await fetchProfileAndSetUser(data.user.id);
        setSession({ access_token: (data as any).access_token ?? "", expires_at: (data as any).expires_at ?? null });
        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      return { success: false, error: err?.message ?? String(err) };
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
      // still clear local state
      setUser(null);
      setSession(null);
    }
  }

  const isAdmin = !!(user && (user.role === "admin" || user.role === "superadmin"));

  const value: AuthContextType = {
    user,
    session,
    setUser,
    setSession,
    login,
    logout,
    isAdmin,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Primary hook — components import { useAuth } from "@/contexts/AuthContext"
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Backwards compatible alias (some files used useAuthContext previously)
export function useAuthContext() {
  return useAuth();
}





/*
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

type User = {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// TODO: Implement server-side admin role assignment through secure backend API

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
            })
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
          })
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
          })
          return { success: true }
        }
      }

      return { success: false, error: "Failed to load user profile" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    }
  }

  // TODO: Admin role assignment must be done through secure backend API or database admin panel
  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Admin role must be assigned manually through database or secure backend
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: data.user.email,
            name,
            role: "user", // Always default to user role
            password_hash: "", // Supabase handles password hashing
          },
        ])

        if (profileError) {
          return { success: false, error: profileError.message }
        }

        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name,
          role: "user",
        })

        return { success: true }
      }

      return { success: false, error: "Registration failed" }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "An error occurred during registration" }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const isAdmin = user?.role === "admin"

  const value = {
    user,
    login,
    logout,
    register,
    isAdmin,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
*/
