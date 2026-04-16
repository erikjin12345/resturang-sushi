"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";
import MenuCategoryComponent from "@/components/MenuCategory";

export default function MenuPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const { lang, t } = useLanguage();
  const { restaurants, menuCategories, menuItems, loading } = useData();

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

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in">
          {restaurant.name}
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground animate-fade-in-up">
          {t.menu.title}
        </h1>
      </div>

      {/* Category quick nav */}
      <nav className="flex flex-wrap gap-2 justify-center mb-16 animate-fade-in-up delay-200">
        {menuCategories
          .filter((cat) => cat.restaurant_id === restaurantId)
          .map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="text-xs uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-foreground px-4 py-2 rounded-full transition-colors"
            >
              {lang === "sv" ? cat.name_sv : cat.name_en}
            </a>
          ))}
      </nav>

      {/* Menu sections */}
      <div className="space-y-16">
        {menuCategories
          .filter((cat) => cat.restaurant_id === restaurantId)
          .map((cat) => (
            <MenuCategoryComponent
              key={cat.id}
              category={cat}
              items={menuItems.filter((i) => i.category_id === cat.id)}
            />
          ))}
      </div>
    </div>
  );
}
