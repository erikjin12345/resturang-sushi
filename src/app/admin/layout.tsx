"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin") {
      router.replace("/admin");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="text-stone-400 animate-pulse text-lg">Laddar...</div>
      </div>
    );
  }

  // Show login page without nav
  if (!user && pathname === "/admin") {
    return <>{children}</>;
  }

  // Show nothing while redirecting to login
  if (!user) {
    return null;
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
