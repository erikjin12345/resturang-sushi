"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            Träkvista & Abrahamsbergs Sushi
          </span>
        </div>
        <p>
          {t.footer.familyOwned} &middot; &copy; {year}{" "}
          {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
