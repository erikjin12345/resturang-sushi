"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";

export default function LocationPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const { lang, t } = useLanguage();
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

  const restaurant = restaurants[restaurantId];
  if (!restaurant) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-stone-700 mb-2 text-center animate-fade-in-up">
        {t.location.title}
      </h1>
      <p className="text-stone-400 text-center mb-4 animate-fade-in delay-100">
        {restaurant.name}
      </p>
      <div className="zen-divider w-32 mx-auto mb-12 animate-fade-in delay-200">
        <span>&#10043;</span>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-sage-100 mb-10 shadow-sm animate-fade-in-up delay-300">
        <iframe
          title={`${restaurant.name} location`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${restaurant.map_query}&output=embed`}
        />
      </div>

      {/* Address & directions */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/80 rounded-xl border border-sage-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-slide-in-left delay-400">
          <h3 className="font-serif text-lg text-stone-700 mb-3">
            {t.location.address}
          </h3>
          <p className="text-stone-500">{restaurant.address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.map_query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sage-600 hover:text-sage-700 font-medium text-sm transition-colors duration-300"
          >
            {t.location.getDirections} &rarr;
          </a>
        </div>

        <div className="bg-white/80 rounded-xl border border-sage-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-slide-in-right delay-400">
          <h3 className="font-serif text-lg text-stone-700 mb-3">
            {t.contact.hours}
          </h3>
          <ul className="space-y-1">
            {restaurant.hours.map((h, i) => (
              <li key={i} className="text-stone-500 text-sm">
                {h[lang]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
