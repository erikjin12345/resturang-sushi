"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { restaurants } = useData();

  const segments = pathname.split("/").filter(Boolean);
  const currentRestaurantId = segments[0] as string | undefined;
  const currentSubpage = segments.slice(1).join("/");
  const currentRestaurant =
    currentRestaurantId && restaurants[currentRestaurantId]
      ? restaurants[currentRestaurantId]
      : null;

  const restaurantIds = Object.keys(restaurants);
  const otherRestaurantId =
    restaurantIds.find((id) => id !== currentRestaurantId) ?? "";

  return (
    <header className="sticky top-0 z-50 bg-sand-50/90 backdrop-blur-md border-b border-sage-100">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Home */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl animate-float">🍣</span>
            <span className="font-serif text-lg font-semibold text-stone-700 group-hover:text-sage-600 transition-colors duration-300">
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
                    className={`text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-sage-700 border-b-2 border-sage-400 pb-0.5"
                        : "text-stone-500 hover:text-sage-700"
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
                className="text-xs bg-sage-50 hover:bg-sage-100 text-sage-700 border border-sage-200 px-3 py-1.5 rounded-full transition-all duration-300 hover:shadow-sm"
              >
                {restaurants[otherRestaurantId].name}
              </Link>
            )}

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "sv" ? "en" : "sv")}
              className="text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-full transition-all duration-300"
            >
              {lang === "sv" ? "EN" : "SV"}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {currentRestaurant && (
          <nav className="md:hidden flex items-center gap-4 mt-2 pt-2 border-t border-sage-100">
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
                  className={`text-sm transition-colors duration-300 ${
                    isActive
                      ? "text-sage-700 font-semibold"
                      : "text-stone-400"
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
