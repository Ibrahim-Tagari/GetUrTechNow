// app/api/auth/login/route.ts
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

type LoginBody = {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 login attempts per minute per IP
    const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown") as string

    if (!rateLimit(`login:${ip}`, 10, 60000)) {
      return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 })
    }

    const body = (await request.json()) as Partial<LoginBody>

    const email = body.email?.trim() ?? ""
    const password = body.password ?? ""

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    // Sign in with Supabase
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // don't leak details for security; give a helpful message
      return NextResponse.json({ error: signInError.message }, { status: 401 })
    }

    if (!signInData || !signInData.session) {
      return NextResponse.json({ error: "No session returned from auth provider." }, { status: 500 })
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", signInData.user.id).single()

    // Prepare response: set an httpOnly cookie for refresh token
    const responsePayload = {
      user: {
        id: signInData.user.id,
        email: signInData.user.email,
        name: profile?.name,
        role: profile?.role || "user",
      },
      session: {
        access_token: signInData.session.access_token,
        expires_at: signInData.session.expires_at ?? null,
      },
    }

    const response = NextResponse.json(responsePayload, { status: 200 })

    // Set httpOnly cookie for refresh token (server-to-server refresh)
    // adjust cookie flags for your environment
    response.cookies.set("sb-refresh-token", signInData.session.refresh_token ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    // Optionally set a short-lived access cookie (if you need it server-side)
    response.cookies.set("sb-access-token", signInData.session.access_token ?? "", {
      httpOnly: true, // set to true if you only need server reading
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: signInData.session.expires_in ?? 60 * 60, // fallback
      path: "/",
    })

    return response
  } catch (err: unknown) {
    // TS: use unknown catch and narrow to Error
    const e = err instanceof Error ? err : new Error(String(err))
    console.error("Login error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
