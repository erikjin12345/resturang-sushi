"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sage-900 text-sage-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-sway">🍣</span>
            <span className="font-serif text-lg text-sage-50">
              Träkvista & Abrahamsbergs Sushi
            </span>
          </div>
          <div className="zen-divider w-48">
            <span>&#10043;</span>
          </div>
          <p className="text-sm text-sage-400">
            {t.footer.familyOwned} &middot; &copy; {year}{" "}
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
