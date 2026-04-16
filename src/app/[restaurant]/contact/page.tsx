"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";

export default function ContactPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const { lang, t } = useLanguage();
  const { restaurants, loading } = useData();
  const [sent, setSent] = useState(false);

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
        {t.contact.title}
      </h1>
      <p className="text-stone-400 text-center mb-4 animate-fade-in delay-100">
        {restaurant.name}
      </p>
      <div className="zen-divider w-32 mx-auto mb-12 animate-fade-in delay-200">
        <span>&#10043;</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-8 animate-slide-in-left delay-300">
          <div>
            <h3 className="font-serif text-lg text-stone-700 mb-2">
              {t.contact.phone}
            </h3>
            <a
              href={`tel:${restaurant.phone}`}
              className="text-sage-600 hover:text-sage-700 font-medium transition-colors duration-300"
            >
              {restaurant.phone}
            </a>
          </div>

          <div>
            <h3 className="font-serif text-lg text-stone-700 mb-2">
              {t.contact.email}
            </h3>
            <a
              href={`mailto:${restaurant.email}`}
              className="text-sage-600 hover:text-sage-700 font-medium transition-colors duration-300"
            >
              {restaurant.email}
            </a>
          </div>

          <div>
            <h3 className="font-serif text-lg text-stone-700 mb-2">
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

        {/* Contact form */}
        <div className="animate-slide-in-right delay-300">
          <h3 className="font-serif text-lg text-stone-700 mb-4">
            {t.contact.sendMessage}
          </h3>
          {sent ? (
            <div className="bg-sage-50 border border-sage-200 rounded-xl p-6 text-sage-800 text-center animate-fade-in-up">
              {t.contact.messageSent}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-stone-500 mb-1">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-stone-700 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-500 mb-1">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-stone-700 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-500 mb-1">
                  {t.contact.message}
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-stone-700 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 transition-all duration-300 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sage-600 hover:bg-sage-700 text-white font-medium py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-sage-200"
              >
                {t.contact.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
