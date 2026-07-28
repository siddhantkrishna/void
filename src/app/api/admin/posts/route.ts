import { db } from "@/db";
import { posts } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { estimateReadingTime, wordCount, slugify } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  const query = db.select().from(posts).orderBy(desc(posts.updatedAt));

  let results;
  if (type) {
    results = await db
      .select()
      .from(posts)
      .where(eq(posts.type, type))
      .orderBy(desc(posts.updatedAt));
  } else {
    results = await query;
  }

  return Response.json({ posts: results });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      content,
      type = "essay",
      status = "draft",
      excerpt,
      categoryId,
      featured,
      pinned,
      metaTitle,
      metaDescription,
    } = body;

    if (!title) {
      return Response.json({ error: "Title is required." }, { status: 400 });
    }

    const slug = slugify(title);
    const contentText = content || "";
    const html = contentText
      .split("\n")
      .map((p: string) => (p.trim() ? `<p>${p.trim()}</p>` : ""))
      .join("\n");

    const [post] = await db
      .insert(posts)
      .values({
        title,
        slug,
        content: contentText,
        contentHtml: html,
        type,
        status,
        excerpt,
        categoryId: categoryId || null,
        authorId: user.id,
        featured: featured || false,
        pinned: pinned || false,
        metaTitle,
        metaDescription,
        readingTime: estimateReadingTime(contentText),
        wordCount: wordCount(contentText),
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    return Response.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return Response.json({ error: message }, { status: 500 });
  }
}
