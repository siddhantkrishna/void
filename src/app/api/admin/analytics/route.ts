import { db } from "@/db";
import { posts, subscribers, pageViews, projects, comments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, count, desc, sql } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      [postCount],
      [publishedCount],
      [draftCount],
      [projectCount],
      [subscriberCount],
      [viewCount],
      [commentCount],
      topPaths,
    ] = await Promise.all([
      db.select({ value: count() }).from(posts),
      db.select({ value: count() }).from(posts).where(eq(posts.status, "published")),
      db.select({ value: count() }).from(posts).where(eq(posts.status, "draft")),
      db.select({ value: count() }).from(projects),
      db.select({ value: count() }).from(subscribers),
      db.select({ value: count() }).from(pageViews),
      db.select({ value: count() }).from(comments),
      db
        .select({
          path: pageViews.path,
          views: count(),
        })
        .from(pageViews)
        .groupBy(pageViews.path)
        .orderBy(desc(sql`count(*)`))
        .limit(10),
    ]);

    return Response.json({
      totalPosts: postCount.value,
      publishedPosts: publishedCount.value,
      draftPosts: draftCount.value,
      totalProjects: projectCount.value,
      totalSubscribers: subscriberCount.value,
      totalViews: viewCount.value,
      totalComments: commentCount.value,
      topPages: topPaths,
    });
  } catch {
    return Response.json({
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalProjects: 0,
      totalSubscribers: 0,
      totalViews: 0,
      totalComments: 0,
      topPages: [],
    });
  }
}
