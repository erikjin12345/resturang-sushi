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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-2 text-center animate-fade-in-up">
        {t.menu.title}
      </h1>
      <p className="text-muted-foreground text-center mb-10 animate-fade-in delay-200">
        {restaurant.name}
      </p>

      {/* Category quick nav */}
      <nav className="flex flex-wrap gap-2 justify-center mb-12 animate-fade-in-up delay-300">
        {menuCategories
          .filter((cat) => cat.restaurant_id === restaurantId)
          .map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-lg transition-colors"
            >
              {lang === "sv" ? cat.name_sv : cat.name_en}
            </a>
          ))}
      </nav>

      {/* Menu sections */}
      <div className="space-y-12">
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
