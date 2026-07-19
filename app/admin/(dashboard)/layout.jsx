"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "@/lib/auth-context";
import { AdminShell } from "@/components/admin/shell";

function DashboardGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/admin/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900">
        <div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;
  return <AdminShell>{children}</AdminShell>;
}

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <DashboardGuard>{children}</DashboardGuard>
    </AuthProvider>
  );
}