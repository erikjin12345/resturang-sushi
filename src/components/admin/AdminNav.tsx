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

            <Link
              href="/admin/pieces"
              className={`text-sm font-medium transition-colors ${
                pathname === "/admin/pieces"
                  ? "text-amber-400"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Bitar
            </Link>

            {restaurantLinks.map((r) => {
              const isActive = currentRestaurantId === r.id;
              return (
                <div key={r.id} className="relative group">
                  <Link
                    href={`/admin/${r.id}`}
                    className={`text-sm font-medium transition-colors py-3 block ${
                      isActive
                        ? "text-amber-400"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    {r.name}
                  </Link>

                  {/* Dropdown on hover */}
                  <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-stone-700 rounded-lg shadow-lg py-1 min-w-[120px] border border-stone-600">
                      <Link
                        href={`/admin/${r.id}`}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === `/admin/${r.id}`
                            ? "text-amber-300 bg-stone-600/50"
                            : "text-stone-300 hover:text-white hover:bg-stone-600"
                        }`}
                      >
                        Detaljer
                      </Link>
                      <Link
                        href={`/admin/${r.id}/menu`}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === `/admin/${r.id}/menu`
                            ? "text-amber-300 bg-stone-600/50"
                            : "text-stone-300 hover:text-white hover:bg-stone-600"
                        }`}
                      >
                        Meny
                      </Link>
                    </div>
                  </div>
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
