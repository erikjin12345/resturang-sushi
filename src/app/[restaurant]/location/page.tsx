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
    <div className="max-w-5xl mx-auto px-6 pt-20 pb-24">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in">
          {restaurant.name}
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground animate-fade-in-up">
          {t.location.title}
        </h1>
      </div>

      {/* Map */}
      {!(restaurant.hidden_fields ?? []).includes("map_query") && (
        <div className="rounded-2xl overflow-hidden border border-border mb-12 animate-fade-in-up delay-200">
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
      )}

      {/* Address & hours */}
      <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
        {!(restaurant.hidden_fields ?? []).includes("address") && (
          <div className="text-center md:text-left animate-slide-in-left delay-300">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {t.location.address}
            </p>
            <p className="font-serif text-2xl text-foreground mb-4">
              {restaurant.address}
            </p>
            {!(restaurant.hidden_fields ?? []).includes("map_query") && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${restaurant.map_query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm uppercase tracking-[0.2em] text-foreground hover:text-muted-foreground transition-colors"
              >
                {t.location.getDirections} &rarr;
              </a>
            )}
          </div>
        )}

        {!(restaurant.hidden_fields ?? []).includes("hours") && (
          <div className="text-center md:text-left animate-slide-in-right delay-300">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {t.contact.hours}
            </p>
            <ul className="space-y-1">
              {restaurant.hours.map((h, i) => (
                <li key={i} className="font-serif text-lg text-foreground">
                  {h[lang]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
