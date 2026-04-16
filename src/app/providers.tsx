"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { DataProvider } from "@/lib/DataContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DataProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </DataProvider>
    </LanguageProvider>
  );
}
