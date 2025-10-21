import { createClient } from "@supabase/supabase-js"

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY is not set. Server admin operations will fail.")
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Create server-side only client using the service role key
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export default supabaseAdmin

/* import { createClient } from "@supabase/supabase-js"

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Exists' : 'Missing')


// Server-only admin client using service role key
// This should ONLY be used in server-side code (API routes, server actions)
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

*/
