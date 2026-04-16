"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";
import type { MenuCategoryRow, MenuItemRow } from "@/lib/supabase";

export default function MenuCategory({
  category,
  items,
}: {
  category: MenuCategoryRow;
  items: MenuItemRow[];
}) {
  const { lang, t } = useLanguage();
  const { menuItemVariations } = useData();

  const categoryName =
    lang === "sv" ? category.name_sv : category.name_en;

  return (
    <section id={category.id} className="scroll-mt-24 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-foreground">
          {categoryName}
        </h2>
        <div className="mt-3 w-12 h-px bg-border mx-auto" />
      </div>
      <div className="grid gap-1">
        {items.map((item) => {
          const variations = menuItemVariations.filter(
            (v) => v.menu_item_id === item.id
          );
          const singleVariation =
            variations.length === 1 ? variations[0] : null;

          return (
            <div
              key={item.id}
              className="py-4 px-4 rounded-lg transition-all duration-300 hover:bg-muted cursor-default"
            >
              {/* Single variation: item name + price on one line */}
              {singleVariation && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-foreground">{item.name}</span>
                  <span className="flex-1 border-b border-dotted border-border translate-y-[-4px]" />
                  <span className="text-foreground whitespace-nowrap tabular-nums">
                    {singleVariation.price} {t.menu.currency}
                  </span>
                </div>
              )}

              {/* Multiple variations: item name then each variation with price */}
              {variations.length > 1 && (
                <>
                  <div className="text-foreground mb-2">{item.name}</div>
                  <div className="space-y-1.5 pl-4 border-l border-border">
                    {variations.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-baseline justify-between gap-4 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {v.name}
                        </span>
                        <span className="flex-1 border-b border-dotted border-border translate-y-[-4px]" />
                        <span className="text-foreground whitespace-nowrap tabular-nums">
                          {v.price} {t.menu.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
