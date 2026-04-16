"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { restaurants } from "@/data/restaurants";
import RestaurantCard from "@/components/RestaurantCard";

export default function LandingPage() {
  const { t } = useLanguage();

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
        <RestaurantCard restaurant={restaurants.trakvista} />
        <RestaurantCard restaurant={restaurants.abrahamsbergs} />
      </div>
    </div>
  );
}
