"use client";

import { useEffect, useState } from "react";
import {
  supabase,
  type MenuCategoryRow,
  type MenuItemRow,
} from "@/lib/supabase";
import MenuCategoryEditor from "@/components/admin/MenuCategoryEditor";

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategoryRow[]>([]);
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatId, setNewCatId] = useState("");
  const [newCatSv, setNewCatSv] = useState("");
  const [newCatEn, setNewCatEn] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  const fetchData = async () => {
    const [catRes, itemRes] = await Promise.all([
      supabase.from("menu_categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (itemRes.data) setItems(itemRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCatId.trim() || !newCatSv.trim()) return;
    setAddingCat(true);
    const { error } = await supabase.from("menu_categories").insert({
      id: newCatId.trim().toLowerCase().replace(/\s+/g, "-"),
      name_sv: newCatSv.trim(),
      name_en: newCatEn.trim() || newCatSv.trim(),
      sort_order: categories.length,
    });
    if (!error) {
      setNewCatId("");
      setNewCatSv("");
      setNewCatEn("");
      fetchData();
    }
    setAddingCat(false);
  };

  if (loading) {
    return (
      <div className="text-stone-400 animate-pulse text-lg py-12 text-center">
        Laddar meny...
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-800 mb-8">Meny</h1>

      <div className="space-y-4">
        {categories.map((cat) => (
          <MenuCategoryEditor
            key={cat.id}
            category={cat}
            items={items.filter((i) => i.category_id === cat.id)}
            onChanged={fetchData}
          />
        ))}
      </div>

      {/* Add new category */}
      <div className="mt-8 bg-white rounded-xl border border-dashed border-stone-300 p-6">
        <h3 className="font-serif text-lg text-stone-700 mb-4">
          Lagg till ny kategori
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              ID (unik nyckel)
            </label>
            <input
              value={newCatId}
              onChange={(e) => setNewCatId(e.target.value)}
              placeholder="t.ex. nigiri"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Namn (SV)
            </label>
            <input
              value={newCatSv}
              onChange={(e) => setNewCatSv(e.target.value)}
              placeholder="t.ex. Nigiri"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Namn (EN)
            </label>
            <input
              value={newCatEn}
              onChange={(e) => setNewCatEn(e.target.value)}
              placeholder="t.ex. Nigiri"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>
        <button
          onClick={handleAddCategory}
          disabled={addingCat || !newCatId.trim() || !newCatSv.trim()}
          className="mt-4 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          {addingCat ? "Laggar till..." : "Lagg till kategori"}
        </button>
      </div>
    </div>
  );
}
