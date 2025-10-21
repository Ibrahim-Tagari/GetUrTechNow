// contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client" // Your helper in /lib/supabase/client
import type { SupabaseClient, Session as SupaSession } from "@supabase/supabase-js"

type User = {
  id: string
  email: string
  name?: string
  role?: "user" | "admin" | string
  [key: string]: any
}

type Session = {
  access_token: string
  expires_at: number | null
} | null

type AuthContextType = {
  user: User | null
  session: Session
  setUser: (u: User | null) => void
  setSession: (s: Session) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Create a fresh browser supabase client per session
  // createClient should use NEXT_PUBLIC_* env vars defined in your .env.local
  const supabase: SupabaseClient = createClient()

  // helper to set user by fetching profile row (if you store profile in users table)
  async function fetchProfileAndSetUser(supabaseUserId: string | null) {
    if (!supabaseUserId) {
      setUser(null)
      return
    }
    try {
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", supabaseUserId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        setUser(null)
      } else if (profile) {
        // adapt this mapping to your users table columns
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name ?? profile.full_name ?? profile.email,
          role: profile.role ?? "user",
          ...profile,
        })
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("fetchProfileAndSetUser", err)
      setUser(null)
    }
  }

  // Initialize session + user on mount
  useEffect(() => {
    let mounted = true
    async function init() {
      setIsLoading(true)
      try {
        // If you're using the new supabase auth in the browser, you might call:
        const { data } = await supabase.auth
          .getSession?.() /* optional chaining in case of different sdk */
          .catch(() => ({ data: { session: null } }))
        // For older/newer versions, you may need to adapt:
        // const { data: sessionData } = await supabase.auth.getSession();
        const currentSession: any = (data && (data.session ?? data)) || null
        setSession(
          currentSession
            ? { access_token: currentSession.access_token, expires_at: currentSession.expires_at ?? null }
            : null,
        )

        const supaUserId = currentSession?.user?.id ?? null
        if (supaUserId) {
          await fetchProfileAndSetUser(supaUserId)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setUser(null)
        setSession(null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    init()

    // listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession: SupaSession | null) => {
      try {
        if (newSession?.user) {
          setSession({
            access_token: (newSession as any).access_token,
            expires_at: (newSession as any).expires_at ?? null,
          })
          await fetchProfileAndSetUser(newSession.user.id)
        } else {
          setSession(null)
          setUser(null)
        }
      } catch (err) {
        console.error("onAuthStateChange handler error:", err)
      }
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // convenience login function (email/password)
  async function login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        return { success: false, error: error.message || String(error) }
      }

      // If login succeeded, fetch profile row
      if (data?.user?.id) {
        await fetchProfileAndSetUser(data.user.id)
        setSession({ access_token: (data as any).access_token ?? "", expires_at: (data as any).expires_at ?? null })
        return { success: true }
      }

      return { success: true }
    } catch (err: any) {
      console.error("Unexpected login error:", err)
      return { success: false, error: err?.message ?? String(err) }
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error("Logout error:", error)
      // still clear local state
      setUser(null)
      setSession(null)
    }
  }

  const isAdmin = !!(user && (user.role === "admin" || user.role === "superadmin"))

  const value: AuthContextType = {
    user,
    session,
    setUser,
    setSession,
    login,
    logout,
    isAdmin,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Primary hook — components import { useAuth } from "@/contexts/AuthContext"
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Backwards compatible alias (some files used useAuthContext previously)
export function useAuthContext() {
  return useAuth()
}
