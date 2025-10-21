import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    )

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user profile with role from database
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", userData.user.id).single()

    return NextResponse.json({
      user: {
        id: userData.user.id,
        email: userData.user.email,
        role: profile?.role || "user",
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
