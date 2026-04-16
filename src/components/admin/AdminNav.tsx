"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const restaurantLinks = [
  { id: "trakvista", name: "Träkvista Sushi" },
  { id: "abrahamsbergs", name: "Abrahamsbergs Sushi" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Extract current restaurant from path: /admin/[restaurant]/...
  const segments = pathname.split("/").filter(Boolean);
  const currentRestaurantId = segments.length >= 2 ? segments[1] : null;

  return (
    <nav className="bg-stone-800 text-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/trakvista"
              className="font-serif text-lg font-semibold text-white"
            >
              Admin
            </Link>

            {restaurantLinks.map((r) => {
              const isActive = currentRestaurantId === r.id;
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <Link
                    href={`/admin/${r.id}`}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-amber-400"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    {r.name}
                  </Link>
                  {isActive && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/${r.id}`}
                        className={`text-xs transition-colors ${
                          pathname === `/admin/${r.id}`
                            ? "text-amber-300 underline underline-offset-4"
                            : "text-stone-500 hover:text-stone-300"
                        }`}
                      >
                        Detaljer
                      </Link>
                      <Link
                        href={`/admin/${r.id}/menu`}
                        className={`text-xs transition-colors ${
                          pathname === `/admin/${r.id}/menu`
                            ? "text-amber-300 underline underline-offset-4"
                            : "text-stone-500 hover:text-stone-300"
                        }`}
                      >
                        Meny
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400">{user?.email}</span>
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-white transition-colors"
            >
              Visa sida
            </Link>
            <button
              onClick={signOut}
              className="text-xs bg-stone-700 hover:bg-stone-600 text-stone-300 px-3 py-1.5 rounded transition-colors"
            >
              Logga ut
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
