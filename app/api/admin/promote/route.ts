// app/api/admin/promote/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    // 1. get token from header or cookie
    let token = "";
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];

    if (!token) {
      const cookie = request.headers.get("cookie") || "";
      const m = cookie.match(/sb-access-token=([^;]+)/);
      token = m ? decodeURIComponent(m[1]) : "";
    }
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    // 2. verify token
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const callerId = userData.user.id;

    // 3. check caller role in profiles
    const { data: callerProfile, error: profileErr } = await supabaseAdmin.from("profiles").select("role").eq("id", callerId).single();
    if (profileErr || !callerProfile) return NextResponse.json({ error: "Caller profile not found" }, { status: 403 });
    if (callerProfile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 4. get target user id from body
    const body = await request.json();
    const { userId: targetUserId, newRole = "admin" } = body;
    if (!targetUserId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // 5. update profiles table
    const { error: updateErr } = await supabaseAdmin.from("profiles").update({ role: newRole }).eq("id", targetUserId);
    if (updateErr) {
      console.error("Promote updateErr:", updateErr);
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: `User ${targetUserId} promoted to ${newRole}` });
  } catch (err) {
    console.error("Admin promote error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
