import { db } from "@/db";
import { quotes } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quotes",
  description: "Words that resonate across time.",
};

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const allQuotes = await db
    .select()
    .from(quotes)
    .orderBy(desc(quotes.createdAt));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-16 animate-fade-in-up text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-void-white mb-4">
          Quotes
        </h1>
        <p className="text-lg text-void-muted max-w-2xl mx-auto">
          Words that resonate across time and space.
        </p>
      </div>

      {allQuotes.length === 0 ? (
        <p className="text-void-muted text-sm text-center">No quotes added yet.</p>
      ) : (
        <div className="space-y-12 animate-fade-in-up animation-delay-200">
          {allQuotes.map((quote) => (
            <blockquote
              key={quote.id}
              className="text-center max-w-2xl mx-auto py-4"
            >
              <p className="text-xl sm:text-2xl text-void-light italic leading-relaxed font-serif">
                &ldquo;{quote.text}&rdquo;
              </p>
              {quote.author && (
                <footer className="mt-4 text-sm text-void-muted">
                  — {quote.author}
                  {quote.source && (
                    <span className="text-void-muted/60">, {quote.source}</span>
                  )}
                </footer>
              )}
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}
