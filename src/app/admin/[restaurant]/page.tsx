"use client";

import { use, useEffect, useState } from "react";
import { supabase, type RestaurantRow } from "@/lib/supabase";
import RestaurantEditor from "@/components/admin/RestaurantEditor";

export default function AdminRestaurantPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant: restaurantId } = use(params);
  const [restaurant, setRestaurant] = useState<RestaurantRow | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .single();
    if (data) setRestaurant(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="text-stone-400 animate-pulse text-lg py-12 text-center">
        Laddar...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-red-500 py-12 text-center">
        Restaurangen hittades inte.
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-800 mb-8">
        {restaurant.name} — Detaljer
      </h1>
      <RestaurantEditor restaurant={restaurant} onSaved={fetchRestaurant} />
    </div>
  );
}
