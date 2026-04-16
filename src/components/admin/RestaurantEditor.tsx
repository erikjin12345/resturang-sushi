"use client";

import { useState } from "react";
import { supabase, type RestaurantRow } from "@/lib/supabase";

export default function RestaurantEditor({
  restaurant,
  onSaved,
}: {
  restaurant: RestaurantRow;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...restaurant });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const set = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setHour = (index: number, lang: "sv" | "en", value: string) => {
    setForm((prev) => {
      const hours = [...prev.hours];
      hours[index] = { ...hours[index], [lang]: value };
      return { ...prev, hours };
    });
  };

  const addHour = () => {
    setForm((prev) => ({
      ...prev,
      hours: [...prev.hours, { sv: "", en: "" }],
    }));
  };

  const removeHour = (index: number) => {
    setForm((prev) => ({
      ...prev,
      hours: prev.hours.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("restaurants")
      .update({
        name: form.name,
        tagline_sv: form.tagline_sv,
        tagline_en: form.tagline_en,
        description_sv: form.description_sv,
        description_en: form.description_en,
        address: form.address,
        phone: form.phone,
        email: form.email,
        hours: form.hours,
        map_query: form.map_query,
        sort_order: form.sort_order,
      })
      .eq("id", restaurant.id);

    setSaving(false);
    if (error) {
      setMessage(`Fel: ${error.message}`);
    } else {
      setMessage("Sparat!");
      onSaved();
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h3 className="font-serif text-xl text-stone-800 mb-6">
        {restaurant.name}
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Namn" value={form.name} onChange={(v) => set("name", v)} />
        <Field
          label="Adress"
          value={form.address}
          onChange={(v) => set("address", v)}
        />
        <Field
          label="Telefon"
          value={form.phone}
          onChange={(v) => set("phone", v)}
        />
        <Field
          label="E-post"
          value={form.email}
          onChange={(v) => set("email", v)}
        />
        <Field
          label="Kart-sokning"
          value={form.map_query}
          onChange={(v) => set("map_query", v)}
        />
        <Field
          label="Sortering"
          value={String(form.sort_order)}
          onChange={(v) => set("sort_order", parseInt(v) || 0)}
          type="number"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <TextArea
          label="Tagline (SV)"
          value={form.tagline_sv}
          onChange={(v) => set("tagline_sv", v)}
        />
        <TextArea
          label="Tagline (EN)"
          value={form.tagline_en}
          onChange={(v) => set("tagline_en", v)}
        />
        <TextArea
          label="Beskrivning (SV)"
          value={form.description_sv}
          onChange={(v) => set("description_sv", v)}
          rows={4}
        />
        <TextArea
          label="Beskrivning (EN)"
          value={form.description_en}
          onChange={(v) => set("description_en", v)}
          rows={4}
        />
      </div>

      {/* Opening hours */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-stone-600">
            Oppettider
          </label>
          <button
            onClick={addHour}
            className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1 rounded transition-colors"
          >
            + Lagg till rad
          </button>
        </div>
        <div className="space-y-2">
          {form.hours.map((h, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={h.sv}
                onChange={(e) => setHour(i, "sv", e.target.value)}
                placeholder="SV"
                className="flex-1 border border-stone-300 rounded-lg px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <input
                value={h.en}
                onChange={(e) => setHour(i, "en", e.target.value)}
                placeholder="EN"
                className="flex-1 border border-stone-300 rounded-lg px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                onClick={() => removeHour(i)}
                className="text-red-400 hover:text-red-600 text-sm px-2"
              >
                Ta bort
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          {saving ? "Sparar..." : "Spara"}
        </button>
        {message && (
          <span
            className={`text-sm ${message.startsWith("Fel") ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-600 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
      />
    </div>
  );
}
