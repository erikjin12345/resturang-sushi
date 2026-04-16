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
        <div className="text-stone-400 animate-pulse font-serif text-xl">
          Laddar...
        </div>
      </div>
    );
  }

  const restaurant = restaurants[restaurantId];
  if (!restaurant) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-stone-800 mb-2 text-center">
        {t.menu.title}
      </h1>
      <p className="text-stone-500 text-center mb-10">{restaurant.name}</p>

      {/* Category quick nav */}
      <nav className="flex flex-wrap gap-2 justify-center mb-12">
        {menuCategories.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="text-xs bg-stone-200 hover:bg-amber-100 text-stone-600 hover:text-amber-800 px-3 py-1.5 rounded-full transition-colors"
          >
            {lang === "sv" ? cat.name_sv : cat.name_en}
          </a>
        ))}
      </nav>

      {/* Menu sections */}
      <div className="space-y-12">
        {menuCategories.map((cat) => (
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
