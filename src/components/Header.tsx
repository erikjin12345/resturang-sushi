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
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Home */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-bold text-foreground">
              {currentRestaurant ? currentRestaurant.name : "Sushi"}
            </span>
          </Link>

          {/* Nav links */}
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
                    className={`text-sm transition-colors ${
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {currentRestaurant && (
              <Link
                href={`/${otherRestaurantId}${currentSubpage ? `/${currentSubpage}` : ""}`}
                className="text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-lg transition-colors"
              >
                {restaurants[otherRestaurantId].name}
              </Link>
            )}

            <button
              onClick={() => setLang(lang === "sv" ? "en" : "sv")}
              className="text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-lg transition-colors"
            >
              {lang === "sv" ? "EN" : "SV"}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {currentRestaurant && (
          <nav className="md:hidden flex items-center gap-4 mt-3 pt-3 border-t border-border">
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
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
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
