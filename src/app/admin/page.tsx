"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin/restaurants");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await signIn(email, password);
    if (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          <h1 className="font-serif text-2xl text-stone-800 text-center mb-2">
            Admin
          </h1>
          <p className="text-stone-500 text-sm text-center mb-8">
            Logga in for att hantera restaurangdata
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                E-post
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Losenord
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {submitting ? "Loggar in..." : "Logga in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
