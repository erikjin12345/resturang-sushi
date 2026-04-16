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
} from "./supabase";

interface DataContextType {
  restaurants: Record<string, RestaurantRow>;
  menuCategories: MenuCategoryRow[];
  menuItems: MenuItemRow[];
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  restaurants: {},
  menuCategories: [],
  menuItems: [],
  loading: true,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<
    Record<string, RestaurantRow>
  >({});
  const [menuCategories, setMenuCategories] = useState<MenuCategoryRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [restRes, catRes, itemRes] = await Promise.all([
        supabase.from("restaurants").select("*").order("sort_order"),
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").order("sort_order"),
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
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{ restaurants, menuCategories, menuItems, loading }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
