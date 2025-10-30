// app/api/account/delete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token via Supabase Admin
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);

    if (userErr || !userData?.user) {
      console.error("Token verification error:", userErr);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const uid = userData.user.id;

    // Delete the authenticated user (requires service role key)
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (delErr) {
      console.error("deleteUser error:", delErr);
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/account/delete error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
