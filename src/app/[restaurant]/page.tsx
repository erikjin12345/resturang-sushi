"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";

export default function StartPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const { lang, t } = useLanguage();
  const { restaurants, menuCategories, menuItems, menuItemVariations, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-muted-foreground animate-pulse text-lg">
          Laddar...
        </div>
      </div>
    );
  }

  const restaurant = restaurants[restaurantId];
  if (!restaurant) notFound();

  const kampanj = menuCategories.find(
    (c) => c.restaurant_id === restaurantId && c.id.startsWith("kampanj")
  );
  const kampanjItems = kampanj
    ? menuItems.filter((i) => i.category_id === kampanj.id && i.restaurant_id === restaurantId)
    : [];

  const description =
    lang === "sv" ? restaurant.description_sv : restaurant.description_en;
  const tagline =
    lang === "sv" ? restaurant.tagline_sv : restaurant.tagline_en;

  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4 animate-fade-in">
          {t.start.familyRestaurant}
        </p>
        <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
          {restaurant.name}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
          {tagline}
        </p>
        <div className="flex items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href={`/${restaurantId}/menu`}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.start.viewMenu}
          </Link>
          <a
            href={
              restaurantId === "trakvista"
                ? "https://qopla.com/restaurant/trakvista-sushi/qWE7OvwYAN/order"
                : "https://qopla.com/restaurant/abrahamsbergs-sushi/qx1JXPYooX/order"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            {t.start.orderNow} &rarr;
          </a>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center animate-fade-in-up">
            {t.start.ourStory}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
            {description}
          </p>
        </div>
      </section>

      {/* Monthly special highlight */}
      {kampanj && kampanjItems.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center animate-fade-in-up">
              {t.start.todaysSpecial}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
              {kampanjItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-${(i + 1) * 100}`}
                >
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-primary font-semibold mt-1">
                    {menuItemVariations.find((v) => v.menu_item_id === item.id)?.price ?? 0} kr
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 animate-fade-in delay-400">
              <Link
                href={`/${restaurantId}/menu`}
                className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
              >
                {t.start.viewMenu} &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
