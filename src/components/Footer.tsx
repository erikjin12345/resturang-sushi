"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍣</span>
            <span className="font-serif text-stone-100">
              Träkvista & Abrahamsbergs Sushi
            </span>
          </div>
          <p className="text-sm text-stone-400">
            {t.footer.familyOwned} &middot; &copy; {year}{" "}
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
