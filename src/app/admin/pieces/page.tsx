"use client";

import { useEffect, useState } from "react";
import { supabase, type PieceRow } from "@/lib/supabase";

const UNIT_OPTIONS = ["st", "bit", "rulle", "nigiri", "maki", "g", "ml"];

export default function AdminPiecesPage() {
  const [pieces, setPieces] = useState<PieceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editForms, setEditForms] = useState<PieceRow[]>([]);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newCategory, setNewCategory] = useState<"ingredient" | "piece">("piece");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPieces = async () => {
    const { data } = await supabase
      .from("pieces")
      .select("*")
      .order("sort_order");
    if (data) {
      setPieces(data);
      setEditForms(data.map((p) => ({ ...p })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPieces();
  }, []);

  const updateForm = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setEditForms((prev) => {
      const copy = [...prev];
      const next = { ...copy[index], [field]: value };
      if (field === "category" && value === "ingredient") {
        next.unit = null;
      }
      copy[index] = next;
      return copy;
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    for (const piece of editForms) {
      const { error } = await supabase
        .from("pieces")
        .update({
          name: piece.name,
          unit: piece.category === "piece" ? piece.unit || null : null,
          category: piece.category,
          sort_order: piece.sort_order,
        })
        .eq("id", piece.id);
      if (error) {
        setMessage(`Fel: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setMessage("Sparat!");
    fetchPieces();
    setTimeout(() => setMessage(null), 2000);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("pieces").insert({
      name: newName.trim(),
      unit: newCategory === "piece" ? newUnit.trim() || null : null,
      category: newCategory,
      sort_order: pieces.length,
    });
    if (!error) {
      setNewName("");
      setNewUnit("");
      setNewCategory("piece");
      fetchPieces();
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Ta bort "${name}"? Den tas bort fran alla menyprodukter.`))
      return;
    const { error } = await supabase.from("pieces").delete().eq("id", id);
    if (error) {
      setMessage(`Fel: ${error.message}`);
    } else {
      fetchPieces();
    }
  };

  if (loading) {
    return (
      <div className="text-stone-400 animate-pulse text-lg py-12 text-center">
        Laddar bitar...
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-800 mb-2">Bitar</h1>
      <p className="text-stone-500 text-sm mb-8">
        Individuella sushi-bitar (nigiri, maki, etc.) som kan kopplas till
        menyprodukter.
      </p>

      {/* Existing pieces */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_80px_80px_40px] gap-2 px-4 py-3 bg-stone-50 border-b border-stone-200 text-xs font-medium text-stone-500">
          <span>Namn</span>
          <span>Kategori</span>
          <span>Enhet</span>
          <span>Sortering</span>
          <span></span>
        </div>
        <div className="divide-y divide-stone-100">
          {editForms.map((piece, index) => (
            <div
              key={piece.id}
              className="grid grid-cols-[1fr_100px_80px_80px_40px] gap-2 px-4 py-2 items-center"
            >
              <input
                value={piece.name}
                onChange={(e) => updateForm(index, "name", e.target.value)}
                className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <select
                value={piece.category}
                onChange={(e) => updateForm(index, "category", e.target.value)}
                className="border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="piece">Bit</option>
                <option value="ingredient">Ingrediens</option>
              </select>
              {piece.category === "piece" ? (
                <select
                  value={piece.unit || ""}
                  onChange={(e) => updateForm(index, "unit", e.target.value)}
                  className="border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="">—</option>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-stone-300 text-sm text-center">—</span>
              )}
              <input
                type="number"
                value={piece.sort_order}
                onChange={(e) =>
                  updateForm(
                    index,
                    "sort_order",
                    parseInt(e.target.value) || 0
                  )
                }
                className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                onClick={() => handleDelete(piece.id, piece.name)}
                className="text-red-400 hover:text-red-600 text-sm text-center"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save all */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          {saving ? "Sparar..." : "Spara alla"}
        </button>
        {message && (
          <span
            className={`text-sm ${message.startsWith("Fel") ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </span>
        )}
      </div>

      {/* Add new piece */}
      <div className="mt-8 bg-white rounded-xl border border-dashed border-stone-300 p-6">
        <h3 className="font-serif text-lg text-stone-700 mb-4">
          Lagg till ny bit
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Namn
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="t.ex. Lax Nigiri"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Kategori
            </label>
            <select
              value={newCategory}
              onChange={(e) => {
                const val = e.target.value as "ingredient" | "piece";
                setNewCategory(val);
                if (val === "ingredient") setNewUnit("");
              }}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="piece">Bit</option>
              <option value="ingredient">Ingrediens</option>
            </select>
          </div>
          {newCategory === "piece" && (
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Enhet
              </label>
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">— (ingen)</option>
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="mt-4 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Lagg till
        </button>
      </div>
    </div>
  );
}
