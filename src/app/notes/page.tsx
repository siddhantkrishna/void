import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short reflections and observations on technology, philosophy, and life.",
};

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await db
    .select()
    .from(posts)
    .where(and(eq(posts.type, "note"), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-16 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-void-white mb-4">
          Notes
        </h1>
        <p className="text-lg text-void-muted max-w-2xl">
          Short reflections, observations, and fragments of thought.
        </p>
      </div>

      {notes.length === 0 ? (
        <p className="text-void-muted text-sm">No notes published yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up animation-delay-200">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="glass rounded-xl p-6 hover:bg-white/5 transition-all group"
            >
              <h2 className="text-base font-medium text-void-white group-hover:text-void-accent transition-colors mb-2">
                {note.title}
              </h2>
              {note.excerpt && (
                <p className="text-xs text-void-muted line-clamp-3 leading-relaxed mb-3">
                  {note.excerpt}
                </p>
              )}
              <span className="text-[11px] text-void-muted">
                {formatDate(note.publishedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
