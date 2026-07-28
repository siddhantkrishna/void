"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-void-white mb-2">Enter the Void</h1>
          <p className="text-sm text-void-muted">Sign in to access the admin panel.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs text-void-muted mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none focus:border-void-blue/50 transition-colors"
              placeholder="admin@void.dev"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-void-muted mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none focus:border-void-blue/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-void-blue text-white text-sm font-medium py-2.5 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-void-muted mt-6">
          <Link href="/" className="text-void-accent hover:text-void-blue transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
