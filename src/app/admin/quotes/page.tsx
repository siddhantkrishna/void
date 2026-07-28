"use client";

import { useState, useEffect } from "react";

interface Quote {
  id: number;
  text: string;
  author: string | null;
  source: string | null;
  featured: boolean;
}

export default function AdminQuotesPage() {
  const [quoteList, setQuoteList] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchQuotes = async () => {
    const res = await fetch("/api/admin/quotes");
    const data = await res.json();
    setQuoteList(data.quotes || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleCreate = async () => {
    if (!text.trim()) return;
    setSaving(true);
    await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, author, source, featured: true }),
    });
    setText("");
    setAuthor("");
    setSource("");
    setSaving(false);
    fetchQuotes();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this quote?")) return;
    await fetch("/api/admin/quotes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchQuotes();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-void-white mb-8">Quotes</h1>

      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-void-white mb-4">Add Quote</h2>
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Quote text..."
            rows={3}
            className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none resize-y"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              className="flex-1 bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
            />
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source"
              className="flex-1 bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add Quote"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-void-muted text-sm">Loading...</p>
      ) : quoteList.length === 0 ? (
        <p className="text-void-muted text-sm">No quotes yet.</p>
      ) : (
        <div className="space-y-3">
          {quoteList.map((quote) => (
            <div key={quote.id} className="glass rounded-xl p-5">
              <p className="text-sm text-void-light italic leading-relaxed">
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-void-muted">
                  {quote.author && <>— {quote.author}</>}
                  {quote.source && <>, {quote.source}</>}
                </span>
                <button
                  onClick={() => handleDelete(quote.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
