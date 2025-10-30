"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use auth context which provides login() that returns { success, error }
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if already logged-in (wait until auth finishes initializing)
  useEffect(() => {
    if (!isLoading && user) {
      console.log("User already logged in → redirecting to home.");
      router.replace("/"); // replace prevents Back button returning to /login
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // IMPORTANT: destructure the object returned
      // by login()
      const { success, error: loginError } = await login(email, password);
      console.log("Login attempt:", success, loginError);

      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to GetUrTechNow!",
        });

        // small delay so toast can be seen and auth context has time to update
        setTimeout(() => router.push("/"), 400);
      } else {
        setError(loginError || "Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      setError(err?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="GetUrTechNow Logo"
              width={200}
              height={67}
              className="mx-auto mb-4"
            />
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your GetUrTechNow account</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Need an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
