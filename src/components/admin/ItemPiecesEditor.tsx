"use client";

import { useEffect, useState } from "react";
import {
  supabase,
  type PieceRow,
  type MenuItemVariationRow,
} from "@/lib/supabase";

interface AssignedPiece {
  id: number;
  piece_id: number;
  quantity: number;
  piece_name: string;
  variation_id: number | null;
}

export default function ItemPiecesEditor({
  menuItemId,
}: {
  menuItemId: number;
}) {
  const [allPieces, setAllPieces] = useState<PieceRow[]>([]);
  const [variations, setVariations] = useState<MenuItemVariationRow[]>([]);
  const [assigned, setAssigned] = useState<AssignedPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVarName, setNewVarName] = useState("");
  const [newVarPrice, setNewVarPrice] = useState("");

  const fetchData = async () => {
    const [piecesRes, varsRes, assignedRes] = await Promise.all([
      supabase.from("pieces").select("*").order("sort_order"),
      supabase
        .from("menu_item_variations")
        .select("*")
        .eq("menu_item_id", menuItemId)
        .order("sort_order"),
      supabase
        .from("menu_item_pieces")
        .select("*, pieces(name)")
        .or(`menu_item_id.eq.${menuItemId},variation_id.not.is.null`),
    ]);
    if (piecesRes.data) setAllPieces(piecesRes.data);
    if (varsRes.data) setVariations(varsRes.data);
    if (assignedRes.data) {
      // Filter to only pieces for this item or its variations
      const varIds = new Set(
        (varsRes.data || []).map((v: MenuItemVariationRow) => v.id)
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = assignedRes.data.filter((r: any) => {
        if (r.menu_item_id === menuItemId && !r.variation_id) return true;
        if (r.variation_id && varIds.has(r.variation_id)) return true;
        return false;
      });
      setAssigned(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filtered.map((r: any) => ({
          id: r.id,
          piece_id: r.piece_id,
          quantity: r.quantity,
          piece_name: r.pieces?.name ?? "",
          variation_id: r.variation_id,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [menuItemId]);

  // --- Variation CRUD ---
  const addVariation = async () => {
    if (!newVarName.trim()) return;
    await supabase.from("menu_item_variations").insert({
      menu_item_id: menuItemId,
      name: newVarName.trim(),
      price: newVarPrice ? parseInt(newVarPrice) : 0,
      sort_order: variations.length,
    });
    setNewVarName("");
    setNewVarPrice("");
    fetchData();
  };

  const deleteVariation = async (varId: number, name: string) => {
    if (!confirm(`Ta bort varianten "${name}" och dess bitar?`)) return;
    await supabase.from("menu_item_variations").delete().eq("id", varId);
    fetchData();
  };

  const updateVariation = async (
    varId: number,
    field: string,
    value: string | number | null
  ) => {
    await supabase
      .from("menu_item_variations")
      .update({ [field]: value })
      .eq("id", varId);
    fetchData();
  };

  // --- Piece assignment ---
  const addPiece = async (
    pieceId: number,
    qty: number,
    variationId: number | null
  ) => {
    await supabase.from("menu_item_pieces").insert({
      menu_item_id: variationId ? null : menuItemId,
      piece_id: pieceId,
      quantity: qty,
      variation_id: variationId,
    });
    fetchData();
  };

  const updatePieceQty = async (id: number, qty: number) => {
    if (qty < 1) return;
    await supabase
      .from("menu_item_pieces")
      .update({ quantity: qty })
      .eq("id", id);
    fetchData();
  };

  const removePiece = async (id: number) => {
    await supabase.from("menu_item_pieces").delete().eq("id", id);
    fetchData();
  };

  if (loading) {
    return <div className="text-stone-400 text-xs py-2">Laddar...</div>;
  }

  // Pieces directly on the item (no variation)
  const directPieces = assigned.filter((a) => !a.variation_id);
  const hasVariations = variations.length > 0;

  return (
    <div className="bg-stone-50 rounded-lg p-4 mt-1 mb-2 border border-stone-200 space-y-4">
      {/* Direct pieces (only show if no variations) */}
      {!hasVariations && (
        <PieceList
          label="Bitar (direkt)"
          pieces={directPieces}
          allPieces={allPieces}
          assignedPieceIds={new Set(directPieces.map((p) => p.piece_id))}
          onAdd={(pieceId, qty) => addPiece(pieceId, qty, null)}
          onUpdateQty={updatePieceQty}
          onRemove={removePiece}
          onCreateAndAdd={async (name, qty) => {
            const { data } = await supabase
              .from("pieces")
              .insert({ name, sort_order: allPieces.length })
              .select("id")
              .single();
            if (data) await addPiece(data.id, qty, null);
          }}
        />
      )}

      {/* Variations */}
      <div>
        <div className="text-xs font-medium text-stone-500 mb-2">
          Varianter
          {!hasVariations && (
            <span className="text-stone-400 font-normal ml-1">
              (t.ex. 8 bitar, 10 bitar, 12 bitar)
            </span>
          )}
        </div>

        {variations.map((v) => {
          const varPieces = assigned.filter(
            (a) => a.variation_id === v.id
          );
          return (
            <div
              key={v.id}
              className="bg-white rounded-lg border border-stone-200 p-3 mb-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={v.name}
                  onChange={(e) =>
                    updateVariation(v.id, "name", e.target.value)
                  }
                  className="flex-1 border border-stone-200 rounded px-2 py-1 text-sm font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
                />
                <input
                  type="number"
                  value={v.price}
                  onChange={(e) =>
                    updateVariation(
                      v.id,
                      "price",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="Pris"
                  className="w-20 border border-stone-200 rounded px-2 py-1 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
                />
                <span className="text-xs text-stone-400">kr</span>
                <button
                  onClick={() => deleteVariation(v.id, v.name)}
                  className="text-red-400 hover:text-red-600 text-xs px-1"
                >
                  X
                </button>
              </div>

              <PieceList
                pieces={varPieces}
                allPieces={allPieces}
                assignedPieceIds={
                  new Set(varPieces.map((p) => p.piece_id))
                }
                onAdd={(pieceId, qty) => addPiece(pieceId, qty, v.id)}
                onUpdateQty={updatePieceQty}
                onRemove={removePiece}
                onCreateAndAdd={async (name, qty) => {
                  const { data } = await supabase
                    .from("pieces")
                    .insert({ name, sort_order: allPieces.length })
                    .select("id")
                    .single();
                  if (data) await addPiece(data.id, qty, v.id);
                }}
              />
            </div>
          );
        })}

        {/* Add variation */}
        <div className="flex items-center gap-2 mt-2">
          <input
            value={newVarName}
            onChange={(e) => setNewVarName(e.target.value)}
            placeholder="Ny variant, t.ex. 10 bitar"
            className="flex-1 border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
            onKeyDown={(e) => e.key === "Enter" && addVariation()}
          />
          <input
            type="number"
            value={newVarPrice}
            onChange={(e) => setNewVarPrice(e.target.value)}
            placeholder="Pris"
            className="w-16 border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
          />
          <button
            onClick={addVariation}
            disabled={!newVarName.trim()}
            className="text-xs bg-stone-700 hover:bg-stone-800 disabled:bg-stone-400 text-white px-3 py-1 rounded-lg transition-colors"
          >
            + Variant
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable piece list for both direct and variation contexts
function PieceList({
  label,
  pieces,
  allPieces,
  assignedPieceIds,
  onAdd,
  onUpdateQty,
  onRemove,
  onCreateAndAdd,
}: {
  label?: string;
  pieces: AssignedPiece[];
  allPieces: PieceRow[];
  assignedPieceIds: Set<number>;
  onAdd: (pieceId: number, qty: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCreateAndAdd: (name: string, qty: number) => void;
}) {
  const [selectedPiece, setSelectedPiece] = useState<number | "">("");
  const [qty, setQty] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  const available = allPieces.filter((p) => !assignedPieceIds.has(p.id));

  return (
    <div>
      {label && (
        <div className="text-xs font-medium text-stone-500 mb-1">
          {label}
        </div>
      )}

      {pieces.length > 0 && (
        <div className="space-y-1 mb-2">
          {pieces.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 text-sm text-stone-700"
            >
              <span className="flex-1">{a.piece_name}</span>
              <input
                type="number"
                min={1}
                value={a.quantity}
                onChange={(e) =>
                  onUpdateQty(a.id, parseInt(e.target.value) || 1)
                }
                className="w-14 border border-stone-300 rounded px-2 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
              <span className="text-xs text-stone-400">st</span>
              <button
                onClick={() => onRemove(a.id)}
                className="text-red-400 hover:text-red-600 text-xs px-1"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add existing piece */}
      <div className="flex items-center gap-2">
        <select
          value={selectedPiece}
          onChange={(e) =>
            setSelectedPiece(e.target.value ? Number(e.target.value) : "")
          }
          className="flex-1 border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
        >
          <option value="">Valj bit...</option>
          {available.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value) || 1)}
          className="w-14 border border-stone-300 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
        <button
          onClick={() => {
            if (selectedPiece) {
              onAdd(Number(selectedPiece), qty);
              setSelectedPiece("");
              setQty(1);
            }
          }}
          disabled={!selectedPiece}
          className="text-xs bg-stone-600 hover:bg-stone-700 disabled:bg-stone-400 text-white px-2 py-1 rounded transition-colors"
        >
          +
        </button>
      </div>

      {/* Create new piece inline */}
      <div className="mt-1">
        {showNew ? (
          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ny bit, t.ex. Lax Nigiri"
              className="flex-1 border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) {
                  onCreateAndAdd(newName.trim(), qty);
                  setNewName("");
                  setShowNew(false);
                }
              }}
            />
            <button
              onClick={() => {
                if (newName.trim()) {
                  onCreateAndAdd(newName.trim(), qty);
                  setNewName("");
                  setShowNew(false);
                }
              }}
              disabled={!newName.trim()}
              className="text-xs bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-white px-2 py-1 rounded transition-colors"
            >
              Skapa
            </button>
            <button
              onClick={() => {
                setShowNew(false);
                setNewName("");
              }}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Avbryt
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNew(true)}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium mt-1"
          >
            + Skapa ny bit
          </button>
        )}
      </div>
    </div>
  );
}
