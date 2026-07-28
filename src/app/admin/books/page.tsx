"use client";

import { useState, useEffect } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  slug: string;
  rating: number | null;
  status: string;
  notes: string | null;
}

export default function AdminBooksPage() {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState("5");
  const [bookStatus, setBookStatus] = useState("read");
  const [saving, setSaving] = useState(false);

  const fetchBooks = async () => {
    const res = await fetch("/api/admin/books");
    const data = await res.json();
    setBookList(data.books || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !author.trim()) return;
    setSaving(true);
    await fetch("/api/admin/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, notes, rating: parseInt(rating), status: bookStatus }),
    });
    setTitle("");
    setAuthor("");
    setNotes("");
    setSaving(false);
    fetchBooks();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-void-white mb-8">Books</h1>

      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-void-white mb-4">Add Book</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              className="flex-1 bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              className="flex-1 bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
            />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes..."
            rows={3}
            className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none resize-y"
          />
          <div className="flex gap-3">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="bg-void-gray border border-white/10 rounded-lg px-3 py-2 text-sm text-void-white"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {"★".repeat(r)} ({r})
                </option>
              ))}
            </select>
            <select
              value={bookStatus}
              onChange={(e) => setBookStatus(e.target.value)}
              className="bg-void-gray border border-white/10 rounded-lg px-3 py-2 text-sm text-void-white"
            >
              <option value="read">Read</option>
              <option value="reading">Reading</option>
              <option value="want-to-read">Want to Read</option>
            </select>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Book"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-void-muted text-sm">Loading...</p>
      ) : bookList.length === 0 ? (
        <p className="text-void-muted text-sm">No books yet.</p>
      ) : (
        <div className="space-y-3">
          {bookList.map((book) => (
            <div key={book.id} className="glass rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-void-white">{book.title}</h3>
                <p className="text-xs text-void-muted">by {book.author}</p>
              </div>
              <div className="flex items-center gap-2">
                {book.rating && (
                  <span className="text-xs text-yellow-400">
                    {"★".repeat(book.rating)}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider text-void-accent bg-void-blue/10 px-2 py-0.5 rounded">
                  {book.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
