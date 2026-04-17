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
    <div className="max-w-5xl mx-auto px-6 pt-20 pb-24">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in">
          {restaurant.name}
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground animate-fade-in-up">
          {t.contact.title}
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-3xl mx-auto">
        {/* Contact info */}
        <div className="space-y-10 animate-slide-in-left delay-200">
          {!(restaurant.hidden_fields ?? []).includes("phone") && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {t.contact.phone}
              </p>
              <a
                href={`tel:${restaurant.phone}`}
                className="font-serif text-2xl text-foreground hover:text-muted-foreground transition-colors"
              >
                {restaurant.phone}
              </a>
            </div>
          )}

          {!(restaurant.hidden_fields ?? []).includes("email") && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {t.contact.email}
              </p>
              <a
                href={`mailto:${restaurant.email}`}
                className="font-serif text-2xl text-foreground hover:text-muted-foreground transition-colors break-all"
              >
                {restaurant.email}
              </a>
            </div>
          )}

          {!(restaurant.hidden_fields ?? []).includes("hours") && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
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

        {/* Contact form */}
        <div className="animate-slide-in-right delay-200">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            {t.contact.sendMessage}
          </p>
          {sent ? (
            <div className="border border-border rounded-2xl p-8 text-foreground text-center animate-fade-in-up">
              {t.contact.messageSent}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border-b border-border px-0 py-2 text-foreground bg-transparent focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border-b border-border px-0 py-2 text-foreground bg-transparent focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {t.contact.message}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                  className="w-full border-b border-border px-0 py-2 text-foreground bg-transparent focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>
              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="mt-4 bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-colors"
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
