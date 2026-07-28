import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essays",
  description: "Long-form explorations of technology, philosophy, intelligence, and the future.",
};

export const dynamic = "force-dynamic";

export default async function EssaysPage() {
  const essays = await db
    .select()
    .from(posts)
    .where(and(eq(posts.type, "essay"), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-16 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-void-white mb-4">
          Essays
        </h1>
        <p className="text-lg text-void-muted max-w-2xl">
          Long-form explorations of ideas at the intersection of technology, philosophy, and the future.
        </p>
      </div>

      {essays.length === 0 ? (
        <p className="text-void-muted text-sm">No essays published yet.</p>
      ) : (
        <div className="space-y-1 animate-fade-in-up animation-delay-200">
          {essays.map((essay) => (
            <Link
              key={essay.id}
              href={`/essays/${essay.slug}`}
              className="block group py-8 border-b border-white/5 hover:border-void-blue/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-medium text-void-white group-hover:text-void-accent transition-colors">
                  {essay.title}
                </h2>
                <span className="text-xs text-void-muted shrink-0">
                  {formatDate(essay.publishedAt)}
                </span>
              </div>
              {essay.excerpt && (
                <p className="mt-3 text-sm text-void-muted leading-relaxed max-w-2xl">
                  {essay.excerpt}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-void-muted">
                {essay.readingTime && essay.readingTime > 0 && (
                  <span>{essay.readingTime} min read</span>
                )}
                {essay.wordCount && essay.wordCount > 0 && (
                  <span>{essay.wordCount.toLocaleString()} words</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
