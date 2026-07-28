import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description: "Deep dives into AI, mathematics, physics, and computational theory.",
};

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const research = await db
    .select()
    .from(posts)
    .where(and(eq(posts.type, "research"), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-16 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-void-white mb-4">
          Research
        </h1>
        <p className="text-lg text-void-muted max-w-2xl">
          Deep explorations into AI, mathematics, physics, and computational theory.
        </p>
      </div>

      {research.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-void-muted text-sm">Research papers coming soon.</p>
          <p className="text-void-muted text-xs mt-2">
            Check back for deep dives into intelligence, computation, and the nature of reality.
          </p>
        </div>
      ) : (
        <div className="space-y-1 animate-fade-in-up animation-delay-200">
          {research.map((post) => (
            <Link
              key={post.id}
              href={`/research/${post.slug}`}
              className="block group py-8 border-b border-white/5 hover:border-void-blue/20 transition-colors"
            >
              <h2 className="text-xl font-medium text-void-white group-hover:text-void-accent transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-sm text-void-muted leading-relaxed">{post.excerpt}</p>
              )}
              <span className="text-xs text-void-muted mt-2 block">{formatDate(post.publishedAt)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
