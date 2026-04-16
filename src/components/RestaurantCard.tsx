"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { RestaurantRow } from "@/lib/supabase";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantRow;
}) {
  const { lang, t } = useLanguage();

  const tagline =
    lang === "sv" ? restaurant.tagline_sv : restaurant.tagline_en;

  return (
    <Link
      href={`/${restaurant.id}`}
      className="group block bg-white/80 rounded-2xl border border-sage-100 overflow-hidden hover:shadow-xl hover:shadow-sage-200/50 hover:border-sage-300 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-sage-100 via-sand-100 to-sage-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        <span className="text-6xl group-hover:scale-110 transition-transform duration-500 animate-float">
          🍣
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-stone-700 group-hover:text-sage-700 transition-colors duration-300">
          {restaurant.name}
        </h3>
        <p className="text-stone-400 text-sm mt-2 leading-relaxed">{tagline}</p>
        <div className="mt-4 flex items-center gap-2 text-sage-600 text-sm font-medium">
          <span>{t.landing.visitUs}</span>
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
