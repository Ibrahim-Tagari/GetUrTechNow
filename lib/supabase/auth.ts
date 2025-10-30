// lib/server-auth.ts
import { supabaseAdmin } from "@/lib/supabase/admin"; // server-only client

export async function getCurrentUserFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/sb-access-token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : "";

  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
