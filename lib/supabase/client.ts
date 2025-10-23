import { createBrowserClient } from "@supabase/ssr"

/**
 * Creates a browser-safe Supabase client using public env vars.
 * Make sure these are set correctly in your Vercel dashboard:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your Vercel environment variables."
    )
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}
