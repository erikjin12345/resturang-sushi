"use client";

import { useEffect, useState } from "react";
import { supabase, type RestaurantRow } from "@/lib/supabase";
import RestaurantEditor from "@/components/admin/RestaurantEditor";

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .order("sort_order");
    if (data) setRestaurants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="text-stone-400 animate-pulse text-lg py-12 text-center">
        Laddar restauranger...
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-800 mb-8">
        Restauranger
      </h1>
      <div className="space-y-8">
        {restaurants.map((r) => (
          <RestaurantEditor
            key={r.id}
            restaurant={r}
            onSaved={fetchRestaurants}
          />
        ))}
      </div>
    </div>
  );
}
