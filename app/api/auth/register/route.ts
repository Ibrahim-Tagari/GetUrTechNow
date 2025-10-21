import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    // Rate limit: 5 registrations per minute per IP
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown") as string
    if (!rateLimit(`register:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 })
    }

    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const { data: existingProfile } = await supabaseAdmin.from("profiles").select("id").eq("email", email).single()

    if (existingProfile) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create user with admin API
    const {
      data: { user },
      error: createError,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (createError || !user) {
      return NextResponse.json({ error: createError?.message || "Failed to create user" }, { status: 400 })
    }

    // inside your POST handler in app/api/auth/register/route.ts
// ... after creating the auth user (user)
// attempt to insert profile
const { data: profileData, error: profileError } = await supabaseAdmin
  .from("profiles")
  .insert([
    {
      id: user.id,
      email: user.email,
      name,
      // add any other profile fields here
    },
  ]);

if (profileError) {
  console.error("Profile insert error:", profileError);
  // attempt to delete the created auth user so there are no orphaned accounts
  try {
    const { error: deleteErr } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteErr) {
      console.error("Failed to delete auth user after profile insert failure:", deleteErr);
    }
  } catch (deleteCatchErr) {
    console.error("Exception while deleting user after profile insert failure:", deleteCatchErr);
  }

  return NextResponse.json({ error: "Failed to create user profile" }, { status: 400 });
}


   /* const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: user.id,
      name,
      email,
      role: "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }) */

    if (profileError) {
      console.error("Profile insert error:", profileError)
      await supabaseAdmin.auth.admin.deleteUser(user.id)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 400 })
    }

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, email: user.email } },
      { status: 201 },
    )
  } catch (err) {
    console.error("Registration error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
