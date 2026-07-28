"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="glass rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-void-white mb-3">
        Stay in the Void
      </h2>
      <p className="text-sm text-void-muted mb-6">
        Subscribe for new essays on intelligence, technology, philosophy, and the future.
        No spam. Unsubscribe anytime.
      </p>

      {status === "success" ? (
        <p className="text-sm text-green-400">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="flex-1 bg-void-gray/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-void-white placeholder:text-void-muted outline-none focus:border-void-blue/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-void-blue text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm text-red-400 mt-3">{message}</p>
      )}
    </div>
  );
}
