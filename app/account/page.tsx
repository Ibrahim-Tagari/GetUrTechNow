"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AccountPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  async function handleDeleteAccount() {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;
    setLoading(true);
    setMessage(null);

    try {
      // Get the current session (access token)
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session?.access_token) {
        throw new Error("No active session found. Please sign in again.");
      }

      const token = data.session.access_token;

      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result?.error || "Failed to delete account");
      }

      // sign out locally
      await supabase.auth.signOut();
      setMessage("Account deleted.");
      router.push("/");
    } catch (err: any) {
      console.error("delete account error", err);
      setMessage("Error deleting account: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-base font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                      <div className="mt-1">
                        {isAdmin ? (
                          <Badge variant="default" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Administrator
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Standard User</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      {loading ? "Deleting..." : "Delete Account"}
                    </button>

                    {message && <p className="mt-3 text-sm">{message}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Stats</CardTitle>
                  <CardDescription>Quick snapshot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Items Purchased</span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reviews Written</span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
