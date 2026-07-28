"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  type: string;
  excerpt: string | null;
}

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          onClose();
        } else {
          onClose(); // toggles via parent
        }
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const navigateTo = (result: SearchResult) => {
    const base = result.type === "project" ? "/projects" : `/${result.type}s`;
    router.push(`${base}/${result.slug}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 glass rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 border-b border-white/5">
          <svg className="w-4 h-4 text-void-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search essays, notes, projects, quotes..."
            className="w-full bg-transparent py-4 px-3 text-sm text-void-white placeholder:text-void-muted outline-none"
          />
          <kbd className="hidden sm:inline text-[10px] text-void-muted bg-void-gray px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {(results.length > 0 || loading) && (
          <div className="max-h-80 overflow-y-auto p-2">
            {loading && (
              <div className="px-3 py-4 text-sm text-void-muted text-center">Searching...</div>
            )}
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => navigateTo(result)}
                className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-void-accent bg-void-blue/10 px-1.5 py-0.5 rounded">
                    {result.type}
                  </span>
                  <span className="text-sm text-void-white group-hover:text-void-accent transition-colors">
                    {result.title}
                  </span>
                </div>
                {result.excerpt && (
                  <p className="text-xs text-void-muted line-clamp-1 ml-[3.5rem]">{result.excerpt}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div className="px-3 py-8 text-sm text-void-muted text-center">
            No results found for &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
