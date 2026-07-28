import { db } from "@/db";
import { posts } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { estimateReadingTime, wordCount, slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const postId = parseInt(id, 10);

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!post) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ post });
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const postId = parseInt(id, 10);
  const body = await request.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (body.title !== undefined) {
    updateData.title = body.title;
    updateData.slug = slugify(body.title);
  }
  if (body.content !== undefined) {
    updateData.content = body.content;
    updateData.contentHtml = body.content
      .split("\n")
      .map((p: string) => (p.trim() ? `<p>${p.trim()}</p>` : ""))
      .join("\n");
    updateData.readingTime = estimateReadingTime(body.content);
    updateData.wordCount = wordCount(body.content);
  }
  if (body.type !== undefined) updateData.type = body.type;
  if (body.status !== undefined) {
    updateData.status = body.status;
    if (body.status === "published" && !body.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }
  if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
  if (body.featured !== undefined) updateData.featured = body.featured;
  if (body.pinned !== undefined) updateData.pinned = body.pinned;
  if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
  if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;

  const [updated] = await db
    .update(posts)
    .set(updateData)
    .where(eq(posts.id, postId))
    .returning();

  return Response.json({ post: updated });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const postId = parseInt(id, 10);

  await db.delete(posts).where(eq(posts.id, postId));
  return Response.json({ success: true });
}
