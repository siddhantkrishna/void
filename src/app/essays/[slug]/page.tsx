import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import ReadingProgress from "@/components/reading-progress";
import NewsletterForm from "@/components/newsletter-form";
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
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.ogImage ? [post.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
    },
  };
}

export default async function EssayPage({ params }: Props) {
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-void-white leading-[1.15] mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-void-muted leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        <div
          className="prose-void animate-fade-in-up animation-delay-200"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || post.content }}
        />

        <footer className="mt-16 pt-8 border-t border-white/5 animate-fade-in-up animation-delay-300">
          <div className="flex items-center gap-4 mb-8">
            <ShareButton title={post.title} />
          </div>
          <NewsletterForm />
        </footer>
      </article>
    </>
  );
}

function ShareButton({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-void-muted">Share this essay:</span>
      <CopyLinkButton />
    </div>
  );
}

function CopyLinkButton() {
  return (
    <button
      className="text-xs text-void-accent hover:text-void-blue transition-colors"
      title="Copy link"
    >
      Copy link
    </button>
  );
}
