import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database row types
export interface RestaurantRow {
  id: string;
  name: string;
  tagline_sv: string;
  tagline_en: string;
  description_sv: string;
  description_en: string;
  address: string;
  phone: string;
  email: string;
  hours: { sv: string; en: string }[];
  map_query: string;
  sort_order: number;
}

export interface MenuCategoryRow {
  id: string;
  name_sv: string;
  name_en: string;
  sort_order: number;
  restaurant_id: string;
}

export interface MenuItemRow {
  id: number;
  category_id: string;
  name: string;
  price: number;
  description_sv: string | null;
  description_en: string | null;
  combo: boolean;
  sort_order: number;
  restaurant_id: string;
}

export type PieceCategory = "ingredient" | "piece";

export interface PieceRow {
  id: number;
  name: string;
  description_sv: string | null;
  description_en: string | null;
  unit: string | null;
  category: PieceCategory;
  sort_order: number;
}

export interface MenuItemVariationRow {
  id: number;
  menu_item_id: number;
  name: string;
  price_override: number | null;
  sort_order: number;
}

export interface MenuItemPieceRow {
  id: number;
  menu_item_id: number | null;
  piece_id: number;
  quantity: number;
  variation_id: number | null;
}

// Fetch functions
export async function getRestaurants(): Promise<RestaurantRow[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getRestaurant(
  id: string
): Promise<RestaurantRow | null> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getMenuCategories(): Promise<MenuCategoryRow[]> {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getMenuItems(): Promise<MenuItemRow[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}
