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
        <div className="text-sage-400 animate-pulse font-serif text-xl">
          Laddar...
        </div>
      </div>
    );
  }

  const restaurant = restaurants[restaurantId];
  if (!restaurant) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-stone-700 mb-2 text-center animate-fade-in-up">
        {t.menu.title}
      </h1>
      <p className="text-stone-400 text-center mb-4 animate-fade-in delay-200">
        {restaurant.name}
      </p>
      <div className="zen-divider w-32 mx-auto mb-10 animate-fade-in delay-300">
        <span>&#10043;</span>
      </div>

      {/* Category quick nav */}
      <nav className="flex flex-wrap gap-2 justify-center mb-12 animate-fade-in-up delay-300">
        {menuCategories
          .filter((cat) => cat.restaurant_id === restaurantId)
          .map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="text-xs bg-sage-50 hover:bg-sage-100 text-sage-600 hover:text-sage-800 border border-sage-100 hover:border-sage-200 px-3 py-1.5 rounded-full transition-all duration-300"
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
