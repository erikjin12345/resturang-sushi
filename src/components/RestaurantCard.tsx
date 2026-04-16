"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Restaurant } from "@/data/restaurants";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const { lang, t } = useLanguage();

  return (
    <Link
      href={`/${restaurant.id}`}
      className="group block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all duration-300"
    >
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          🍣
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-stone-800 group-hover:text-amber-700 transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-stone-500 text-sm mt-2">
          {restaurant.tagline[lang]}
        </p>
        <div className="mt-4 flex items-center gap-2 text-amber-700 text-sm font-medium">
          <span>{t.landing.visitUs}</span>
          <span className="group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
