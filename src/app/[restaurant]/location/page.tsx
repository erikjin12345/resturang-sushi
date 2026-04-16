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
        <div className="text-muted-foreground animate-pulse text-lg">
          Laddar...
        </div>
      </div>
    );
  }

  const restaurant = restaurants[restaurantId];
  if (!restaurant) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-2 text-center animate-fade-in-up">
        {t.location.title}
      </h1>
      <p className="text-muted-foreground text-center mb-12 animate-fade-in delay-100">
        {restaurant.name}
      </p>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border mb-10 animate-fade-in-up delay-200">
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
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 animate-slide-in-left delay-300">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {t.location.address}
              </h3>
              <p className="text-muted-foreground text-sm">{restaurant.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${restaurant.map_query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
              >
                {t.location.getDirections} &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 animate-slide-in-right delay-300">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {t.contact.hours}
              </h3>
              <ul className="space-y-1 mt-1">
                {restaurant.hours.map((h, i) => (
                  <li key={i} className="text-muted-foreground text-sm">
                    {h[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
