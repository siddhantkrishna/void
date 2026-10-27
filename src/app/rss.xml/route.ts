import { db } from "@/db";
import { posts } from "@/db/schema";
import { and, desc, eq, isNull, lte, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
const BASE_URL = "https://blogs.siddhantkrishna.com";

function escapeXml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[char] ?? char);
}

export async function GET() {
  let items: Array<{ title: string; slug: string; type: string; excerpt: string | null; publishedAt: Date | null }> = [];
  try {
    items = await db.select({
      title: posts.title, slug: posts.slug, type: posts.type,
      excerpt: posts.excerpt, publishedAt: posts.publishedAt,
    }).from(posts).where(and(
      eq(posts.status, "published"),
      or(isNull(posts.publishedAt), lte(posts.publishedAt, new Date())),
    )).orderBy(desc(posts.publishedAt)).limit(50);
  } catch (error) {
    console.error("Unable to load RSS content:", error);
  }

  const folders: Record<string, string> = { essay: "essays", note: "notes", research: "research" };
  const entries = items.filter((item) => Boolean(folders[item.type])).map((item) => {
    const url = `${BASE_URL}/${folders[item.type]}/${encodeURIComponent(item.slug)}`;
    return `<item><title>${escapeXml(item.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(item.excerpt || "")}</description>${item.publishedAt ? `<pubDate>${item.publishedAt.toUTCString()}</pubDate>` : ""}</item>`;
  }).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel><title>Siddhant Krishna's Void</title><link>${BASE_URL}</link>
<description>Essays, notes, and research by Siddhant Krishna.</description>
<language>en-IN</language>
<atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${entries}</channel></rss>`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}
