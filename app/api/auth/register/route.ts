import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

console.log("[REGISTER API] Route hit");
console.log("SUPABASE_SERVICE_ROLE_KEY length:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
console.log("SUPABASE_SERVICE_ROLE_KEY starts with:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));

export async function POST(req: Request) {
  try {
    // Rate limit: 5 registrations per minute per IP
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown") as string;
    if (!rateLimit(`register:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { email, password, name } = await req.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if email already exists in profiles table
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (existingProfile) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Create new user via Supabase Admin API
    const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    const user = data?.user;
    if (createError || !user) {
      console.error("Auth user creation failed:", createError);
      return NextResponse.json({ error: createError?.message || "Failed to create user" }, { status: 400 });
    }

    // ✅ Insert or update profile using upsert
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: user.id,
          name,
          email,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      // Optionally delete user if profile fails to avoid orphan accounts
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user.id, email: user.email },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
