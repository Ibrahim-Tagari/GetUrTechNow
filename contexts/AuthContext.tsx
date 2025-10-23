"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
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

  const supabase: SupabaseClient = createClient()

  // ---- Fetch user profile from Supabase "profiles" table ----
  async function fetchProfileAndSetUser(supabaseUserId: string | null) {
    if (!supabaseUserId) {
      setUser(null)
      return
    }

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUserId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        setUser(null)
        return
      }

      if (profile) {
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
      console.error("fetchProfileAndSetUser error:", err)
      setUser(null)
    }
  }

  // ---- Initialize session on mount ----
  useEffect(() => {
    let mounted = true

    async function init() {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) console.error("Error getting session:", error)

        const currentSession = data?.session ?? null

        setSession(
          currentSession
            ? {
                access_token: currentSession.access_token,
                expires_at: currentSession.expires_at ?? null,
              }
            : null
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

    // ---- Listen for auth state changes ----
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession: SupaSession | null) => {
      try {
        if (newSession?.user) {
          setSession({
            access_token: newSession.access_token,
            expires_at: newSession.expires_at ?? null,
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

  // ---- Fixed login function ----
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

      const user = data?.user
      const session = data?.session

      if (!user || !session) {
        console.warn("Login succeeded but no session returned.")
        return { success: false, error: "No session returned from Supabase." }
      }

      // Store session + user
      setSession({
        access_token: session.access_token,
        expires_at: session.expires_at ?? null,
      })

      await fetchProfileAndSetUser(user.id)

      return { success: true }
    } catch (err: any) {
      console.error("Unexpected login error:", err)
      return { success: false, error: err?.message ?? String(err) }
    }
  }

  // ---- Logout ----
  async function logout() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error("Logout error:", error)
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

// ---- Hook for components ----
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Optional alias for backwards compatibility
export function useAuthContext() {
  return useAuth()
}
