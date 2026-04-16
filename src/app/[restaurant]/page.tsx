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
        <div className="text-sage-400 animate-pulse font-serif text-xl">
          Laddar...
        </div>
      </div>
    );
  }

  const restaurant = restaurants[restaurantId];
  if (!restaurant) notFound();

  const kampanj = menuCategories.find(
    (c) => c.restaurant_id === restaurantId && c.id.startsWith("kampanj")
  );
  const kampanjItems = kampanj
    ? menuItems.filter((i) => i.category_id === kampanj.id && i.restaurant_id === restaurantId)
    : [];

  const description =
    lang === "sv" ? restaurant.description_sv : restaurant.description_en;
  const tagline =
    lang === "sv" ? restaurant.tagline_sv : restaurant.tagline_en;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-sage-50 via-sand-50 to-background py-24 overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-12 left-[15%] text-3xl opacity-20 animate-drift" style={{ animationDelay: "0s" }}>
          🌿
        </div>
        <div className="absolute top-20 right-[20%] text-2xl opacity-15 animate-drift" style={{ animationDelay: "2s" }}>
          🍃
        </div>
        <div className="absolute bottom-16 left-[25%] text-2xl opacity-15 animate-drift" style={{ animationDelay: "4s" }}>
          🌸
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <p className="text-sage-600 font-medium text-sm tracking-[0.2em] uppercase mb-3 animate-fade-in">
            {t.start.familyRestaurant}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-700 mb-4 animate-fade-in-up">
            {restaurant.name}
          </h1>
          <div className="zen-divider w-48 mx-auto my-5 animate-fade-in delay-200">
            <span>&#10043;</span>
          </div>
          <p className="text-stone-400 text-lg max-w-lg mx-auto animate-fade-in-up delay-200">
            {tagline}
          </p>
          <Link
            href={`/${restaurantId}/menu`}
            className="inline-block mt-8 bg-sage-600 hover:bg-sage-700 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-sage-200 animate-fade-in-up delay-400"
          >
            {t.start.viewMenu}
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl text-stone-700 mb-6 text-center animate-fade-in-up">
          {t.start.ourStory}
        </h2>
        <p className="text-stone-500 leading-relaxed text-center text-lg animate-fade-in-up delay-200">
          {description}
        </p>
      </section>

      {/* Order online */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white/80 rounded-2xl border border-sage-100 p-8 md:p-10 text-center shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
          <h2 className="font-serif text-2xl text-stone-700 mb-3">
            {t.start.orderOnline}
          </h2>
          <p className="text-stone-400 mb-6">
            {t.start.orderOnlineSubtitle}
          </p>
          <a
            href={
              restaurantId === "trakvista"
                ? "https://qopla.com/restaurant/trakvista-sushi/qWE7OvwYAN/order"
                : "https://qopla.com/restaurant/abrahamsbergs-sushi/qx1JXPYooX/order"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sage-600 hover:bg-sage-700 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-sage-200"
          >
            {t.start.orderNow} &rarr;
          </a>
        </div>
      </section>

      {/* Monthly special highlight */}
      {kampanj && kampanjItems.length > 0 && (
        <section className="bg-sage-50 border-y border-sage-100 py-12">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-serif text-2xl text-sage-800 mb-6 text-center animate-fade-in-up">
              {t.start.todaysSpecial}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {kampanjItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`bg-white/80 rounded-xl p-5 border border-sage-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up delay-${(i + 1) * 100}`}
                >
                  <h3 className="font-medium text-stone-700">{item.name}</h3>
                  <p className="text-sage-600 font-semibold mt-1">
                    {item.price} kr
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6 animate-fade-in delay-500">
              <Link
                href={`/${restaurantId}/menu`}
                className="text-sage-600 hover:text-sage-700 font-medium text-sm transition-colors duration-300"
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
