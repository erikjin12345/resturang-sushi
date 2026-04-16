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
  const { menuItemVariations, menuItemPieces } = useData();

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
          const hasMultipleVariations = variations.length > 1;
          const singleVariation =
            variations.length === 1 ? variations[0] : null;

          return (
            <div
              key={item.id}
              className="group py-3 px-4 rounded-lg transition-all duration-300 hover:bg-muted cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-foreground font-medium">
                    {item.name}
                  </span>
                </div>
                {/* Single variation: show price inline */}
                {singleVariation && (
                  <span className="text-foreground font-semibold whitespace-nowrap ml-4">
                    {singleVariation.price} {t.menu.currency}
                  </span>
                )}
                {/* Multiple variations: show price range */}
                {hasMultipleVariations && (
                  <span className="text-foreground font-semibold whitespace-nowrap ml-4">
                    {Math.min(...variations.map((v) => v.price))}–
                    {Math.max(...variations.map((v) => v.price))}{" "}
                    {t.menu.currency}
                  </span>
                )}
              </div>

              {/* Multiple variations: show each with price */}
              {hasMultipleVariations && (
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                  <div className="overflow-hidden">
                    <div className="pt-2 space-y-1">
                      {variations.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between text-sm text-muted-foreground"
                        >
                          <span>{v.name}</span>
                          <span className="font-medium">
                            {v.price} {t.menu.currency}
                          </span>
                        </div>
                      ))}
                    </div>
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
