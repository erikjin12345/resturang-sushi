"use client";

import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { DataProvider } from "@/lib/DataContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <LanguageProvider>
      <DataProvider>
        {!isAdmin && <Header />}
        <main className="flex-1">{children}</main>
        {!isAdmin && <Footer />}
      </DataProvider>
    </LanguageProvider>
  );
}
