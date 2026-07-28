import { db } from "@/db";
import { posts, projects, quotes } from "@/db/schema";
import { eq, or, ilike, and } from "drizzle-orm";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return Response.json({ results: [] });
  }

  const pattern = `%${q.trim()}%`;

  try {
    const [postResults, projectResults] = await Promise.all([
      db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          type: posts.type,
          excerpt: posts.excerpt,
        })
        .from(posts)
        .where(
          and(
            eq(posts.status, "published"),
            or(
              ilike(posts.title, pattern),
              ilike(posts.content, pattern),
              ilike(posts.excerpt, pattern)
            )
          )
        )
        .limit(10),
      db
        .select({
          id: projects.id,
          title: projects.title,
          slug: projects.slug,
          description: projects.description,
        })
        .from(projects)
        .where(
          and(
            eq(projects.status, "published"),
            or(
              ilike(projects.title, pattern),
              ilike(projects.description, pattern)
            )
          )
        )
        .limit(5),
    ]);

    const results = [
      ...postResults.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: p.type,
        excerpt: p.excerpt,
      })),
      ...projectResults.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: "project",
        excerpt: p.description,
      })),
    ];

    return Response.json({ results });
  } catch {
    return Response.json({ results: [] });
  }
}
