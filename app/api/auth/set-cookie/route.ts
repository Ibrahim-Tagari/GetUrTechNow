// app/api/auth/set-cookie/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken, expiresIn } = await request.json();

    if (!accessToken) return NextResponse.json({ error: "Missing access token" }, { status: 400 });

    const res = NextResponse.json({ ok: true });

    // set token cookie(s) for server to use. Use secure in production
    const secure = process.env.NODE_ENV === "production";

    // Access token cookie (shorter lived)
    res.cookies.set("sb-access-token", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn ?? 60 * 60 * 24, // fallback to 1 day
    });

    // Optionally store refresh token safely (if you want server refresh flow)
    if (refreshToken) {
      res.cookies.set("sb-refresh-token", refreshToken, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // e.g. 30 days
      });
    }

    return res;
  } catch (err) {
    console.error("set-cookie error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
