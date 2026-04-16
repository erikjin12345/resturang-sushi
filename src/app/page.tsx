"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";
import RestaurantCard from "@/components/RestaurantCard";

export default function LandingPage() {
  const { t } = useLanguage();
  const { restaurants, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-sage-400 animate-pulse font-serif text-xl">
          Laddar...
        </div>
      </div>
    );
  }

  const restaurantList = Object.values(restaurants);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-sage-600 font-medium text-sm tracking-[0.2em] uppercase mb-3 animate-fade-in">
          {t.landing.familyOwned}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-stone-700 mb-4 animate-fade-in-up">
          {t.landing.welcome}
        </h1>
        <div className="zen-divider w-48 mx-auto my-6 animate-fade-in delay-200">
          <span>&#10043;</span>
        </div>
        <p className="text-stone-400 text-lg max-w-md mx-auto animate-fade-in-up delay-300">
          {t.landing.subtitle}
        </p>
      </div>

      {/* Restaurant selector */}
      <h2 className="font-serif text-2xl text-stone-600 text-center mb-8 animate-fade-in-up delay-400">
        {t.landing.chooseRestaurant}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {restaurantList.map((r, i) => (
          <div
            key={r.id}
            className={`animate-fade-in-up ${i === 0 ? "delay-500" : "delay-600"}`}
          >
            <RestaurantCard restaurant={r} />
          </div>
        ))}
      </div>
    </div>
  );
}
