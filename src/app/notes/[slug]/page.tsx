import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import ReadingProgress from "@/components/reading-progress";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <header className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3 text-xs text-void-muted mb-4">
            <time dateTime={post.publishedAt?.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
            {post.readingTime && post.readingTime > 0 && (
              <>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-void-white leading-[1.15]">
            {post.title}
          </h1>
        </header>

        <div
          className="prose-void animate-fade-in-up animation-delay-200"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || post.content }}
        />
      </article>
    </>
  );
}
