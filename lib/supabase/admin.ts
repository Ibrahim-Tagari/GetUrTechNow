// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"

// This client uses the SERVICE ROLE key (server only). DO NOT expose this key to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
