"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient, Session as SupaSession } from "@supabase/supabase-js"

// ---------------- Types ----------------
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

// ---------------- Context ----------------
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase: SupabaseClient = createClient()

  // ---------------- Fetch user profile ----------------
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

  // ---------------- Initialize session ----------------
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    async function init() {
      setIsLoading(true)

      try {
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
          console.error(
            "❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — check your Vercel environment variables."
          )
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) console.error("Error getting session:", error)

        const currentSession = data?.session ?? null

        if (mounted) {
          setSession(
            currentSession
              ? {
                  access_token: currentSession.access_token,
                  expires_at: currentSession.expires_at ?? null,
                }
              : null
          )
        }

        const supaUserId = currentSession?.user?.id ?? null
        if (supaUserId && mounted) {
          await fetchProfileAndSetUser(supaUserId)
        } else if (mounted) {
          setUser(null)
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
        if (mounted) {
          setUser(null)
          setSession(null)
        }
      } finally {
        // Delay to let Supabase hydrate session cookies properly
        timeoutId = setTimeout(() => {
          if (mounted) setIsLoading(false)
        }, 600)
      }
    }

    init()

    // ---------------- Listen for auth state changes ----------------
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession: SupaSession | null) => {
        try {
          if (!mounted) return

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

          setIsLoading(false)
        } catch (err) {
          console.error("onAuthStateChange handler error:", err)
          setIsLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  // ---------------- Login ----------------
  async function login(email: string, password: string) {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        setIsLoading(false)
        return { success: false, error: error.message || String(error) }
      }

      const user = data?.user
      const session = data?.session

      if (!user || !session) {
        console.warn("Login succeeded but no session returned.")
        setIsLoading(false)
        return { success: false, error: "No session returned from Supabase." }
      }

      setSession({
        access_token: session.access_token,
        expires_at: session.expires_at ?? null,
      })

      await fetchProfileAndSetUser(user.id)
      await supabase.auth.getSession() // refresh cookie/session
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      console.error("Unexpected login error:", err)
      setIsLoading(false)
      return { success: false, error: err?.message ?? String(err) }
    }
  }

  // ---------------- Logout ----------------
  async function logout() {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------- Context Value ----------------
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

// ---------------- Hooks ----------------
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

export function useAuthContext() {
  return useAuth()
}
