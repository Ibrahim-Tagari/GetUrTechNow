// app/api/auth/login/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type LoginBody = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 login attempts per minute per IP
    const ip =
      (request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown") as string;

    if (!rateLimit(`login:${ip}`, 10, 60000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as Partial<LoginBody>;

    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    // Sign in with Supabase
    const {
      data: signInData,
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // don't leak details for security; give a helpful message
      return NextResponse.json({ error: signInError.message }, { status: 401 });
    }

    if (!signInData || !signInData.session) {
      return NextResponse.json(
        { error: "No session returned from auth provider." },
        { status: 500 },
      );
    }

    // Prepare response: set an httpOnly cookie for refresh token
    const responsePayload = {
      user: signInData.user ?? null,
      session: {
        access_token: signInData.session.access_token,
        expires_at: signInData.session.expires_at ?? null,
      },
    };

    const response = NextResponse.json(responsePayload, { status: 200 });

    // Set httpOnly cookie for refresh token (server-to-server refresh)
    // adjust cookie flags for your environment
    response.cookies.set("sb-refresh-token", signInData.session.refresh_token ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Optionally set a short-lived access cookie (if you need it server-side)
    response.cookies.set("sb-access-token", signInData.session.access_token ?? "", {
      httpOnly: true, // set to true if you only need server reading
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: signInData.session.expires_in ?? 60 * 60, // fallback
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    // TS: use unknown catch and narrow to Error
    const e = err instanceof Error ? err : new Error(String(err));
    console.error("Login error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


   /* const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    }) 

    // Example client-side login (e.g., in login page or auth context)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: error.message };
  }

  // data.session should contain access_token, refresh_token, expires_in
  const session = data.session;
  if (session) {
    await fetch("/api/auth/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
      }),
    });
  }

  return { ok: true };
}


    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.session) {
      return NextResponse.json({ error: "Login failed" }, { status: 401 })
    }

    // Get user profile with role
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

    const { data: profile } = await supabaseAdmin.from("users").select("*").eq("id", data.user.id).single()

    // Set HttpOnly cookie with session
    const response = NextResponse.json(
      {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || "user",
        },
      },
      { status: 200 },
    )

    // Set HttpOnly, Secure, SameSite cookies
    response.cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
*/
