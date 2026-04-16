"use client";

import { useState } from "react";
import { supabase, type MenuCategoryRow, type MenuItemRow } from "@/lib/supabase";

export default function MenuCategoryEditor({
  category,
  items,
  onChanged,
}: {
  category: MenuCategoryRow;
  items: MenuItemRow[];
  onChanged: () => void;
}) {
  const [catForm, setCatForm] = useState({ ...category });
  const [itemForms, setItemForms] = useState<MenuItemRow[]>(
    items.map((i) => ({ ...i }))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const updateItem = (index: number, field: string, value: string | number | boolean) => {
    setItemForms((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addItem = () => {
    setItemForms((prev) => [
      ...prev,
      {
        id: 0, // will be assigned by DB
        category_id: category.id,
        name: "",
        price: 0,
        description_sv: null,
        description_en: null,
        combo: false,
        sort_order: prev.length,
      },
    ]);
  };

  const removeItem = async (index: number) => {
    const item = itemForms[index];
    if (item.id > 0) {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", item.id);
      if (error) {
        setMessage(`Fel: ${error.message}`);
        return;
      }
    }
    setItemForms((prev) => prev.filter((_, i) => i !== index));
    onChanged();
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Update category
    const { error: catError } = await supabase
      .from("menu_categories")
      .update({
        name_sv: catForm.name_sv,
        name_en: catForm.name_en,
        sort_order: catForm.sort_order,
      })
      .eq("id", category.id);

    if (catError) {
      setMessage(`Fel: ${catError.message}`);
      setSaving(false);
      return;
    }

    // Upsert items
    for (const item of itemForms) {
      if (!item.name.trim()) continue;

      if (item.id > 0) {
        // Update existing
        const { error } = await supabase
          .from("menu_items")
          .update({
            name: item.name,
            price: item.price,
            combo: item.combo,
            description_sv: item.description_sv || null,
            description_en: item.description_en || null,
            sort_order: item.sort_order,
          })
          .eq("id", item.id);
        if (error) {
          setMessage(`Fel: ${error.message}`);
          setSaving(false);
          return;
        }
      } else {
        // Insert new
        const { error } = await supabase.from("menu_items").insert({
          category_id: category.id,
          name: item.name,
          price: item.price,
          combo: item.combo,
          description_sv: item.description_sv || null,
          description_en: item.description_en || null,
          sort_order: item.sort_order,
        });
        if (error) {
          setMessage(`Fel: ${error.message}`);
          setSaving(false);
          return;
        }
      }
    }

    setSaving(false);
    setMessage("Sparat!");
    onChanged();
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDeleteCategory = async () => {
    if (
      !confirm(
        `Ta bort "${catForm.name_sv}" och alla dess ${itemForms.length} produkter?`
      )
    )
      return;

    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", category.id);
    if (error) {
      setMessage(`Fel: ${error.message}`);
    } else {
      onChanged();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Category header — click to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors text-left"
      >
        <div>
          <span className="font-serif text-lg text-stone-800">
            {catForm.name_sv}
          </span>
          <span className="text-stone-400 text-sm ml-3">
            {itemForms.length} produkter
          </span>
        </div>
        <span className="text-stone-400 text-xl">
          {expanded ? "\u2212" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-stone-100">
          {/* Category fields */}
          <div className="grid md:grid-cols-3 gap-4 mt-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Kategorinamn (SV)
              </label>
              <input
                value={catForm.name_sv}
                onChange={(e) =>
                  setCatForm((p) => ({ ...p, name_sv: e.target.value }))
                }
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Kategorinamn (EN)
              </label>
              <input
                value={catForm.name_en}
                onChange={(e) =>
                  setCatForm((p) => ({ ...p, name_en: e.target.value }))
                }
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Sortering
              </label>
              <input
                type="number"
                value={catForm.sort_order}
                onChange={(e) =>
                  setCatForm((p) => ({
                    ...p,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_80px_60px_40px] gap-2 text-xs font-medium text-stone-500 px-1">
              <span>Namn</span>
              <span>Pris</span>
              <span>Kombo</span>
              <span></span>
            </div>
            {itemForms.map((item, index) => (
              <div
                key={item.id || `new-${index}`}
                className="grid grid-cols-[1fr_80px_60px_40px] gap-2 items-center"
              >
                <input
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  placeholder="Produktnamn"
                  className="border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, "price", parseInt(e.target.value) || 0)
                  }
                  className="border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <label className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={item.combo}
                    onChange={(e) =>
                      updateItem(index, "combo", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-300"
                  />
                </label>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-400 hover:text-red-600 text-sm text-center"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="mt-3 text-sm text-amber-700 hover:text-amber-800 font-medium"
          >
            + Lagg till produkt
          </button>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-4 border-t border-stone-100 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              {saving ? "Sparar..." : "Spara kategori"}
            </button>
            <button
              onClick={handleDeleteCategory}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Ta bort kategori
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
      )}
    </div>
  );
}
