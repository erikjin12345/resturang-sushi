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
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-foreground">{categoryName}</h2>
        <div className="mt-3 w-12 h-px bg-border mx-auto" />
      </div>
      <div className="grid gap-1">
        {items.map((item) => {
          const variations = menuItemVariations.filter(
            (v) => v.menu_item_id === item.id && v.visible
          );
          const singleVariation =
            variations.length === 1 ? variations[0] : null;
          const desc =
            lang === "sv" ? item.description_sv : item.description_en;
          const directPieces = menuItemPieces.filter(
            (p) => p.menu_item_id === item.id && !p.variation_id && p.visible
          );
          const variationPieces = menuItemPieces.filter(
            (p) =>
              p.visible && variations.some((v) => v.id === p.variation_id)
          );
          const hasDetail =
            !!desc ||
            variations.length > 1 ||
            (singleVariation && !!singleVariation.size) ||
            directPieces.length > 0 ||
            variationPieces.length > 0;

          const priceLabel = (() => {
            if (singleVariation) return `${singleVariation.price} ${t.menu.currency}`;
            if (variations.length > 1) {
              const prices = variations.map((v) => v.price);
              const min = Math.min(...prices);
              const max = Math.max(...prices);
              return min === max
                ? `${min} ${t.menu.currency}`
                : `${min}–${max} ${t.menu.currency}`;
            }
            return "";
          })();

          return (
            <div
              key={item.id}
              className="group rounded-lg transition-all duration-300 hover:bg-muted"
            >
              <div className="py-4 px-4 flex items-baseline gap-4">
                <span className="text-foreground">{item.name}</span>
                <span className="flex-1 border-b border-dotted border-border translate-y-[-4px]" />
                <span className="text-foreground whitespace-nowrap tabular-nums">
                  {priceLabel}
                </span>
                {hasDetail && (
                  <span className="text-muted-foreground text-xs transition-transform group-hover:rotate-180">
                    ▾
                  </span>
                )}
              </div>

              {hasDetail && (
                <div className="hidden group-hover:block px-4 pb-4 pt-1 space-y-3">
                  {desc && (
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  )}

                  {singleVariation && (
                    <VariationDetail
                      size={singleVariation.size}
                      pieces={menuItemPieces.filter(
                        (p) =>
                          p.visible &&
                          (p.variation_id === singleVariation.id ||
                            (p.menu_item_id === item.id && !p.variation_id))
                      )}
                    />
                  )}

                  {variations.length > 1 && (
                    <div className="space-y-3 pl-4 border-l border-border">
                      {variations.map((v) => (
                        <div key={v.id}>
                          <div className="flex items-baseline justify-between gap-4 text-sm">
                            <span className="text-foreground">{v.name}</span>
                            <span className="flex-1 border-b border-dotted border-border translate-y-[-4px]" />
                            <span className="text-foreground whitespace-nowrap tabular-nums">
                              {v.price} {t.menu.currency}
                            </span>
                          </div>
                          <VariationDetail
                            size={v.size}
                            pieces={menuItemPieces.filter(
                              (p) => p.visible && p.variation_id === v.id
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VariationDetail({
  size,
  pieces,
}: {
  size: string | null;
  pieces: { id: number; piece_name: string; piece_unit: string | null; quantity: number }[];
}) {
  if (!size && pieces.length === 0) return null;
  return (
    <div className="mt-1 space-y-1">
      {size && (
        <div className="text-xs text-muted-foreground">{size}</div>
      )}
      {pieces.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {pieces
            .map((p) =>
              p.piece_unit
                ? `${p.quantity} ${p.piece_unit} ${p.piece_name}`
                : p.piece_name
            )
            .join(", ")}
        </div>
      )}
    </div>
  );
}
