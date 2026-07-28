import { db } from "@/db";
import { books } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Books that shaped my thinking.",
};

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const allBooks = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-16 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-void-white mb-4">
          Books
        </h1>
        <p className="text-lg text-void-muted max-w-2xl">
          Books that have shaped my thinking about technology, consciousness, civilization, and the human condition.
        </p>
      </div>

      {allBooks.length === 0 ? (
        <p className="text-void-muted text-sm">No books added yet.</p>
      ) : (
        <div className="space-y-6 animate-fade-in-up animation-delay-200">
          {allBooks.map((book) => (
            <div
              key={book.id}
              className="glass rounded-xl p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-void-white mb-1">
                    {book.title}
                  </h2>
                  <p className="text-sm text-void-muted mb-3">
                    by {book.author}
                  </p>
                  {book.rating && (
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < book.rating! ? "text-yellow-400" : "text-void-gray"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-void-accent bg-void-blue/10 px-2 py-0.5 rounded shrink-0">
                  {book.status}
                </span>
              </div>
              {book.notes && (
                <p className="text-sm text-void-muted leading-relaxed mt-2">
                  {book.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
