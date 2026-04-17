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

  const hidden = new Set(restaurant.hidden_fields ?? []);
  const descriptionKey = lang === "sv" ? "description_sv" : "description_en";
  const taglineKey = lang === "sv" ? "tagline_sv" : "tagline_en";
  const description = hidden.has(descriptionKey)
    ? ""
    : lang === "sv"
      ? restaurant.description_sv
      : restaurant.description_en;
  const tagline = hidden.has(taglineKey)
    ? ""
    : lang === "sv"
      ? restaurant.tagline_sv
      : restaurant.tagline_en;

  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in">
          {t.start.familyRestaurant}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6 leading-tight animate-fade-in-up">
          {restaurant.name}
        </h1>
        {tagline && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12 animate-fade-in-up delay-200">
            {tagline}
          </p>
        )}
        <div className="flex items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href={`/${restaurantId}/menu`}
            className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
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
            className="border border-border text-foreground px-8 py-3 rounded-full text-sm font-medium hover:border-foreground transition-colors"
          >
            {t.start.orderNow} &rarr;
          </a>
        </div>
      </section>

      {/* About */}
      {description && (
        <section className="border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-24 text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground animate-fade-in-up">
              {t.start.ourStory}
            </h2>
            <div className="w-12 h-px bg-border mx-auto my-8 animate-fade-in delay-200" />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-300">
              {description}
            </p>
          </div>
        </section>
      )}

      {/* Monthly special highlight */}
      {kampanj && kampanjItems.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-24">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in-up">
                {t.start.todaysSpecial}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground animate-fade-in-up delay-100">
                {lang === "sv" ? "Månadens special" : "This month"}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {kampanjItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`border border-border rounded-2xl p-8 hover:border-foreground transition-all duration-500 animate-fade-in-up delay-${(i + 2) * 100}`}
                >
                  <h3 className="font-serif text-2xl text-foreground">{item.name}</h3>
                  <div className="w-8 h-px bg-border my-4" />
                  <p className="text-foreground tabular-nums">
                    {menuItemVariations.find((v) => v.menu_item_id === item.id)?.price ?? 0} kr
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12 animate-fade-in delay-500">
              <Link
                href={`/${restaurantId}/menu`}
                className="text-sm uppercase tracking-[0.2em] text-foreground hover:text-muted-foreground transition-colors"
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
