"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { restaurants } from "@/data/restaurants";

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const segments = pathname.split("/").filter(Boolean);
  const currentRestaurantId = segments[0] as string | undefined;
  const currentSubpage = segments.slice(1).join("/");
  const currentRestaurant =
    currentRestaurantId && restaurants[currentRestaurantId]
      ? restaurants[currentRestaurantId]
      : null;
  const otherRestaurantId =
    currentRestaurantId === "trakvista" ? "abrahamsbergs" : "trakvista";

  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Home */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🍣</span>
            <span className="font-serif text-lg font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
              {currentRestaurant ? currentRestaurant.name : "Sushi"}
            </span>
          </Link>

          {/* Nav links — only show when on a restaurant page */}
          {currentRestaurant && (
            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: `/${currentRestaurantId}`, label: t.nav.start },
                { href: `/${currentRestaurantId}/menu`, label: t.nav.menu },
                {
                  href: `/${currentRestaurantId}/contact`,
                  label: t.nav.contact,
                },
                {
                  href: `/${currentRestaurantId}/location`,
                  label: t.nav.location,
                },
              ].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-amber-700 border-b-2 border-amber-700 pb-0.5"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side: restaurant switcher + language */}
          <div className="flex items-center gap-3">
            {/* Restaurant switcher */}
            {currentRestaurant && (
              <Link
                href={`/${otherRestaurantId}${currentSubpage ? `/${currentSubpage}` : ""}`}
                className="text-xs bg-stone-200 hover:bg-amber-100 text-stone-700 hover:text-amber-800 px-3 py-1.5 rounded-full transition-colors"
              >
                {restaurants[otherRestaurantId].name}
              </Link>
            )}

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "sv" ? "en" : "sv")}
              className="text-xs font-medium bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {lang === "sv" ? "EN" : "SV"}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {currentRestaurant && (
          <nav className="md:hidden flex items-center gap-4 mt-2 pt-2 border-t border-stone-200">
            {[
              { href: `/${currentRestaurantId}`, label: t.nav.start },
              { href: `/${currentRestaurantId}/menu`, label: t.nav.menu },
              {
                href: `/${currentRestaurantId}/contact`,
                label: t.nav.contact,
              },
              {
                href: `/${currentRestaurantId}/location`,
                label: t.nav.location,
              },
            ].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-amber-700 font-semibold"
                      : "text-stone-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
