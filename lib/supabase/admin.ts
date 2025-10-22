import { createClient } from "@supabase/supabase-js";

console.log(
  "[Admin Client] Service key length:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.length
);


if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars:", {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    roleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  throw new Error("Missing Supabase environment variables for admin client");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
