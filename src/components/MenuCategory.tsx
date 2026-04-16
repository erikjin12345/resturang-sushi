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
    <section id={category.id} className="scroll-mt-24 animate-fade-in-up">
      <h2 className="font-serif text-2xl text-stone-700 mb-4 pb-2 border-b border-sage-200">
        {categoryName}
      </h2>
      <div className="grid gap-1">
        {items.map((item) => {
          const description =
            lang === "sv" ? item.description_sv : item.description_en;
          return (
            <div
              key={item.id}
              className="group py-3 px-4 rounded-xl transition-all duration-300 hover:bg-sage-50 hover:shadow-sm hover:scale-[1.01] cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-stone-700 font-medium group-hover:text-sage-800 transition-colors duration-300">
                    {item.name}
                  </span>
                  {item.combo && (
                    <span className="ml-2 text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                      {t.menu.combo}
                    </span>
                  )}
                </div>
                <span className="text-stone-600 font-semibold whitespace-nowrap ml-4 group-hover:text-sage-700 transition-colors duration-300">
                  {item.price} {t.menu.currency}
                </span>
              </div>
              {/* Description appears on hover with smooth expand */}
              {description && (
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                  <div className="overflow-hidden">
                    <p className="text-sm text-stone-400 group-hover:text-stone-500 pt-1.5 transition-colors duration-300">
                      {description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
