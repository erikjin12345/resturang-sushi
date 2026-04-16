"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { MenuCategoryRow, MenuItemRow } from "@/lib/supabase";

export default function MenuCategory({
  category,
  items,
}: {
  category: MenuCategoryRow;
  items: MenuItemRow[];
}) {
  const { lang, t } = useLanguage();

  const categoryName =
    lang === "sv" ? category.name_sv : category.name_en;

  return (
    <section id={category.id} className="scroll-mt-24">
      <h2 className="font-serif text-2xl text-stone-800 mb-4 pb-2 border-b border-stone-200">
        {categoryName}
      </h2>
      <div className="grid gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <div className="flex-1">
              <span className="text-stone-800 font-medium">{item.name}</span>
              {item.combo && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {t.menu.combo}
                </span>
              )}
              {item.description_sv && (
                <p className="text-sm text-stone-500 mt-0.5">
                  {lang === "sv" ? item.description_sv : item.description_en}
                </p>
              )}
            </div>
            <span className="text-stone-700 font-semibold whitespace-nowrap ml-4">
              {item.price} {t.menu.currency}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
