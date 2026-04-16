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
      <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
        {categoryName}
      </h2>
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
              className="py-3 px-4 rounded-lg transition-all duration-300 hover:bg-muted cursor-default"
            >
              {/* Single variation: item name + price on one line */}
              {singleVariation && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    {item.name}
                  </span>
                  <span className="text-foreground font-semibold whitespace-nowrap ml-4">
                    {singleVariation.price} {t.menu.currency}
                  </span>
                </div>
              )}

              {/* Multiple variations: item name then each variation with price */}
              {variations.length > 1 && (
                <>
                  <div className="text-foreground font-medium mb-2">
                    {item.name}
                  </div>
                  <div className="space-y-1 pl-4 border-l-2 border-border">
                    {variations.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {v.name}
                        </span>
                        <span className="text-foreground font-semibold whitespace-nowrap ml-4">
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
