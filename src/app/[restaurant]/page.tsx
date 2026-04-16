"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";

export default function StartPage({
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

  const kampanj = menuCategories.find((c) => c.id === "kampanj");
  const kampanjItems = kampanj
    ? menuItems.filter((i) => i.category_id === "kampanj")
    : [];

  const description =
    lang === "sv" ? restaurant.description_sv : restaurant.description_en;
  const tagline =
    lang === "sv" ? restaurant.tagline_sv : restaurant.tagline_en;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-stone-200 to-stone-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-700 font-medium text-sm tracking-widest uppercase mb-3">
            {t.start.familyRestaurant}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">
            {restaurant.name}
          </h1>
          <p className="text-stone-500 text-lg max-w-lg mx-auto">{tagline}</p>
          <Link
            href={`/${restaurantId}/menu`}
            className="inline-block mt-8 bg-amber-700 hover:bg-amber-800 text-white font-medium px-8 py-3 rounded-full transition-colors"
          >
            {t.start.viewMenu}
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl text-stone-800 mb-6 text-center">
          {t.start.ourStory}
        </h2>
        <p className="text-stone-600 leading-relaxed text-center text-lg">
          {description}
        </p>
      </section>

      {/* Monthly special highlight */}
      {kampanj && kampanjItems.length > 0 && (
        <section className="bg-amber-50 border-y border-amber-200 py-12">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-serif text-2xl text-amber-800 mb-6 text-center">
              {t.start.todaysSpecial}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {kampanjItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm"
                >
                  <h3 className="font-medium text-stone-800">{item.name}</h3>
                  <p className="text-amber-700 font-semibold mt-1">
                    {item.price} kr
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href={`/${restaurantId}/menu`}
                className="text-amber-700 hover:text-amber-800 font-medium text-sm"
              >
                {t.start.viewMenu} &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
