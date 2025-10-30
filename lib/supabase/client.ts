import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
}

// Singleton for general use
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Factory for server components / dynamic creation
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Compatibility export (in case older code uses this)
export { createClient as createSupabaseClient };


/*
// lib/supabase/client.ts
import { createClient as createBrowserClient } from "@supabase/supabase-js"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
  */
