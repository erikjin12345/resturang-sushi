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
        <div className="text-muted-foreground animate-pulse text-lg">
          Laddar...
        </div>
      </div>
    );
  }

  const restaurantList = Object.values(restaurants);

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero section */}
      <div className="text-center pt-20 pb-12 px-6">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in">
          {t.landing.familyOwned}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6 animate-fade-in-up">
          {t.landing.welcome}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          {t.landing.subtitle}
        </p>
      </div>

      {/* Restaurant cards */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-serif text-2xl text-center text-foreground mb-10 animate-fade-in-up delay-300">
          {t.landing.chooseRestaurant}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {restaurantList.map((r, i) => (
            <div
              key={r.id}
              className={`animate-fade-in-up ${i === 0 ? "delay-400" : "delay-500"}`}
            >
              <RestaurantCard restaurant={r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
