"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { restaurants } from "@/data/restaurants";

export default function ContactPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const { lang, t } = useLanguage();
  const restaurant = restaurants[restaurantId];
  const [sent, setSent] = useState(false);

  if (!restaurant) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-stone-800 mb-2 text-center">
        {t.contact.title}
      </h1>
      <p className="text-stone-500 text-center mb-12">{restaurant.name}</p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-8">
          <div>
            <h3 className="font-serif text-lg text-stone-800 mb-2">
              {t.contact.phone}
            </h3>
            <a
              href={`tel:${restaurant.phone}`}
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              {restaurant.phone}
            </a>
          </div>

          <div>
            <h3 className="font-serif text-lg text-stone-800 mb-2">
              {t.contact.email}
            </h3>
            <a
              href={`mailto:${restaurant.email}`}
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              {restaurant.email}
            </a>
          </div>

          <div>
            <h3 className="font-serif text-lg text-stone-800 mb-2">
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

        {/* Contact form */}
        <div>
          <h3 className="font-serif text-lg text-stone-800 mb-4">
            {t.contact.sendMessage}
          </h3>
          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-green-800 text-center">
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
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  {t.contact.message}
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 rounded-lg transition-colors"
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
