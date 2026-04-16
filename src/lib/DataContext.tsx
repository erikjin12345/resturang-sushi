"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  supabase,
  type RestaurantRow,
  type MenuCategoryRow,
  type MenuItemRow,
  type PieceRow,
  type MenuItemPieceRow,
} from "./supabase";

interface MenuItemPieceWithName extends MenuItemPieceRow {
  piece_name: string;
  piece_unit: string | null;
}

interface DataContextType {
  restaurants: Record<string, RestaurantRow>;
  menuCategories: MenuCategoryRow[];
  menuItems: MenuItemRow[];
  menuItemPieces: MenuItemPieceWithName[];
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  restaurants: {},
  menuCategories: [],
  menuItems: [],
  menuItemPieces: [],
  loading: true,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<
    Record<string, RestaurantRow>
  >({});
  const [menuCategories, setMenuCategories] = useState<MenuCategoryRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRow[]>([]);
  const [menuItemPieces, setMenuItemPieces] = useState<MenuItemPieceWithName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [restRes, catRes, itemRes, piecesRes] = await Promise.all([
        supabase.from("restaurants").select("*").order("sort_order"),
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").order("sort_order"),
        supabase.from("menu_item_pieces").select("*, pieces(name, unit)"),
      ]);

      if (restRes.data) {
        const map: Record<string, RestaurantRow> = {};
        for (const r of restRes.data) {
          map[r.id] = r;
        }
        setRestaurants(map);
      }
      if (catRes.data) setMenuCategories(catRes.data);
      if (itemRes.data) setMenuItems(itemRes.data);
      if (piecesRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMenuItemPieces(
          piecesRes.data.map((r: any) => ({
            id: r.id,
            menu_item_id: r.menu_item_id,
            piece_id: r.piece_id,
            quantity: r.quantity,
            variation_id: r.variation_id ?? null,
            piece_name: r.pieces?.name ?? "",
            piece_unit: r.pieces?.unit ?? null,
          }))
        );
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{ restaurants, menuCategories, menuItems, menuItemPieces, loading }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
