"use client";

import { useEffect, useState } from "react";
import {
  supabase,
  type PieceRow,
} from "@/lib/supabase";

export default function ItemPiecesEditor({
  menuItemId,
}: {
  menuItemId: number;
}) {
  const [allPieces, setAllPieces] = useState<PieceRow[]>([]);
  const [assigned, setAssigned] = useState<
    { id: number; menu_item_id: number; piece_id: number; quantity: number; piece_name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedPieceId, setSelectedPieceId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [showNewPiece, setShowNewPiece] = useState(false);
  const [newPieceName, setNewPieceName] = useState("");

  const fetchData = async () => {
    const [piecesRes, assignedRes] = await Promise.all([
      supabase.from("pieces").select("*").order("sort_order"),
      supabase
        .from("menu_item_pieces")
        .select("*, pieces(name)")
        .eq("menu_item_id", menuItemId),
    ]);
    if (piecesRes.data) setAllPieces(piecesRes.data);
    if (assignedRes.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAssigned(
        assignedRes.data.map((r: any) => ({
          id: r.id as number,
          menu_item_id: r.menu_item_id as number,
          piece_id: r.piece_id as number,
          quantity: r.quantity as number,
          piece_name: r.pieces?.name ?? "",
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [menuItemId]);

  const handleAdd = async () => {
    if (!selectedPieceId || quantity < 1) return;
    const { error } = await supabase.from("menu_item_pieces").upsert(
      {
        menu_item_id: menuItemId,
        piece_id: Number(selectedPieceId),
        quantity,
      },
      { onConflict: "menu_item_id,piece_id" }
    );
    if (!error) {
      setSelectedPieceId("");
      setQuantity(1);
      fetchData();
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newPieceName.trim()) return;
    const { data, error } = await supabase
      .from("pieces")
      .insert({ name: newPieceName.trim(), sort_order: allPieces.length })
      .select("id")
      .single();
    if (error || !data) return;

    await supabase.from("menu_item_pieces").insert({
      menu_item_id: menuItemId,
      piece_id: data.id,
      quantity,
    });

    setNewPieceName("");
    setQuantity(1);
    setShowNewPiece(false);
    fetchData();
  };

  const handleUpdateQty = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    await supabase
      .from("menu_item_pieces")
      .update({ quantity: newQty })
      .eq("id", id);
    fetchData();
  };

  const handleRemove = async (id: number) => {
    await supabase.from("menu_item_pieces").delete().eq("id", id);
    fetchData();
  };

  if (loading) {
    return (
      <div className="text-stone-400 text-xs py-2">Laddar bitar...</div>
    );
  }

  const assignedPieceIds = new Set(assigned.map((a) => a.piece_id));
  const availablePieces = allPieces.filter(
    (p) => !assignedPieceIds.has(p.id)
  );

  return (
    <div className="bg-stone-50 rounded-lg p-3 mt-1 mb-2 border border-stone-200">
      <div className="text-xs font-medium text-stone-500 mb-2">
        Innehall (bitar)
      </div>

      {/* Currently assigned pieces */}
      {assigned.length > 0 && (
        <div className="space-y-1 mb-3">
          {assigned.map((a) => (
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
                  handleUpdateQty(a.id, parseInt(e.target.value) || 1)
                }
                className="w-14 border border-stone-300 rounded px-2 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
              <span className="text-xs text-stone-400">st</span>
              <button
                onClick={() => handleRemove(a.id)}
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
          value={selectedPieceId}
          onChange={(e) =>
            setSelectedPieceId(
              e.target.value ? Number(e.target.value) : ""
            )
          }
          className="flex-1 border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
        >
          <option value="">
            {availablePieces.length > 0
              ? "Valj bit..."
              : "Inga fler bitar tillgangliga"}
          </option>
          {availablePieces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-14 border border-stone-300 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
        <button
          onClick={handleAdd}
          disabled={!selectedPieceId}
          className="text-xs bg-stone-700 hover:bg-stone-800 disabled:bg-stone-400 text-white px-3 py-1 rounded-lg transition-colors"
        >
          Lagg till
        </button>
      </div>

      {/* Create new piece inline */}
      <div className="mt-2">
        {showNewPiece ? (
          <div className="flex items-center gap-2">
            <input
              value={newPieceName}
              onChange={(e) => setNewPieceName(e.target.value)}
              placeholder="Namn pa ny bit, t.ex. Lax Nigiri"
              className="flex-1 border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-300"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
            />
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-14 border border-stone-300 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-300"
            />
            <button
              onClick={handleCreateAndAdd}
              disabled={!newPieceName.trim()}
              className="text-xs bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-white px-3 py-1 rounded-lg transition-colors"
            >
              Skapa
            </button>
            <button
              onClick={() => {
                setShowNewPiece(false);
                setNewPieceName("");
              }}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Avbryt
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewPiece(true)}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium"
          >
            + Skapa ny bit
          </button>
        )}
      </div>
    </div>
  );
}
