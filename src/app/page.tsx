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
        <div className="text-stone-400 animate-pulse font-serif text-xl">
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
        <p className="text-amber-700 font-medium text-sm tracking-widest uppercase mb-3">
          {t.landing.familyOwned}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">
          {t.landing.welcome}
        </h1>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          {t.landing.subtitle}
        </p>
      </div>

      {/* Restaurant selector */}
      <h2 className="font-serif text-2xl text-stone-700 text-center mb-8">
        {t.landing.chooseRestaurant}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {restaurantList.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
