"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/admin/restaurants", label: "Restauranger" },
  { href: "/admin/menu", label: "Meny" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-stone-800 text-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/restaurants"
            className="font-serif text-lg font-semibold text-white"
          >
            Admin
          </Link>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-amber-400"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
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
    </nav>
  );
}
