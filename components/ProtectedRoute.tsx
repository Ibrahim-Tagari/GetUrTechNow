"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.warn("Unauthenticated access detected → redirecting to /login");
        router.replace("/login");
      } else if (requireAdmin && !isAdmin) {
        router.replace("/");
      }
    }
  }, [user, isAdmin, isLoading, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 text-lg">
        Checking authentication...
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) return null;

  return <>{children}</>;
}
