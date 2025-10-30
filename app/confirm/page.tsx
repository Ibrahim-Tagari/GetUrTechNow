"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const handleConfirm = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error("Session exchange failed", error);
        alert("Could not log you in automatically. Please sign in manually.");
        router.push("/login");
      } else {
        // Optionally call your /api/auth/set-cookie endpoint to store the session in HttpOnly cookie
        const session = data.session;
        await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: session?.access_token,
            refreshToken: session?.refresh_token,
            expiresIn: session?.expires_in,
          }),
        });
        router.push("/");
      }
    };
    handleConfirm();
  }, [router]);

  return <p className="text-center p-10">Verifying your email… please wait.</p>;
}
