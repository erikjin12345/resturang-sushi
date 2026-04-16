"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { RestaurantRow } from "@/lib/supabase";

const restaurantImages: Record<string, string> = {
  trakvista: "/sushi-1.jpg",
  abrahamsbergs: "/sushi-2.jpg",
};

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantRow;
}) {
  const { lang, t } = useLanguage();

  const tagline =
    lang === "sv" ? restaurant.tagline_sv : restaurant.tagline_en;
  const imageSrc = restaurantImages[restaurant.id] || "/sushi-1.jpg";

  return (
    <Link
      href={`/${restaurant.id}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/5] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
    >
      {/* Background image */}
      <Image
        src={imageSrc}
        alt={restaurant.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <h3 className="font-serif text-3xl text-white mb-2 drop-shadow-lg">
          {restaurant.name}
        </h3>
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          {tagline}
        </p>
        <div className="flex items-center gap-2 text-white font-medium text-sm">
          <span>{t.landing.visitUs}</span>
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
