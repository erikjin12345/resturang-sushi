"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { restaurants } from "@/data/restaurants";

export default function LocationPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const { lang, t } = useLanguage();
  const restaurant = restaurants[restaurantId];

  if (!restaurant) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-stone-800 mb-2 text-center">
        {t.location.title}
      </h1>
      <p className="text-stone-500 text-center mb-12">{restaurant.name}</p>

      {/* Map placeholder */}
      <div className="rounded-2xl overflow-hidden border border-stone-200 mb-10">
        <iframe
          title={`${restaurant.name} location`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${restaurant.mapQuery}&output=embed`}
        />
      </div>

      {/* Address & directions */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="font-serif text-lg text-stone-800 mb-3">
            {t.location.address}
          </h3>
          <p className="text-stone-600">{restaurant.address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-amber-700 hover:text-amber-800 font-medium text-sm"
          >
            {t.location.getDirections} &rarr;
          </a>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="font-serif text-lg text-stone-800 mb-3">
            {t.contact.hours}
          </h3>
          <ul className="space-y-1">
            {restaurant.hours.map((h, i) => (
              <li key={i} className="text-stone-600 text-sm">
                {h[lang]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
