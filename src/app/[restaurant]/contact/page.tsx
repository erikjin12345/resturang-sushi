"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useData } from "@/lib/DataContext";
import { supabase } from "@/lib/supabase";

export default function ContactPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const { lang, t } = useLanguage();
  const { restaurants, loading } = useData();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const { error: fnError } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        restaurant_name: restaurant.name,
        restaurant_id: restaurantId,
      },
    });

    setSending(false);

    if (fnError) {
      setError(lang === "sv" ? "Något gick fel. Försök igen." : "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-2 text-center animate-fade-in-up">
        {t.contact.title}
      </h1>
      <p className="text-muted-foreground text-center mb-12 animate-fade-in delay-100">
        {restaurant.name}
      </p>

      <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
        {/* Contact info */}
        <div className="space-y-8 animate-slide-in-left delay-200">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.contact.phone}</p>
              <a
                href={`tel:${restaurant.phone}`}
                className="text-foreground hover:text-primary font-medium transition-colors"
              >
                {restaurant.phone}
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.contact.email}</p>
              <a
                href={`mailto:${restaurant.email}`}
                className="text-foreground hover:text-primary font-medium transition-colors"
              >
                {restaurant.email}
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.contact.hours}</p>
              <ul className="space-y-1 mt-1">
                {restaurant.hours.map((h, i) => (
                  <li key={i} className="text-foreground text-sm">
                    {h[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="animate-slide-in-right delay-200">
          <h3 className="font-semibold text-foreground mb-4">
            {t.contact.sendMessage}
          </h3>
          {sent ? (
            <div className="bg-card border border-border rounded-xl p-6 text-foreground text-center animate-fade-in-up">
              {t.contact.messageSent}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  {t.contact.message}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>
              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {sending
                  ? (lang === "sv" ? "Skickar..." : "Sending...")
                  : t.contact.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
