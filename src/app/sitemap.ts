import type { MetadataRoute } from "next";
import { db } from "@/db";
import { posts, projects } from "@/db/schema";
import { and, eq, lte, or, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";
const BASE_URL = "https://blogs.siddhantkrishna.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["", "/about", "/essays", "/notes", "/research", "/projects", "/books", "/quotes"];
  const staticRoutes: MetadataRoute.Sitemap = paths.map((path) => ({ url: BASE_URL + path }));

  try {
    const [articles, work] = await Promise.all([
      db.select({
        slug: posts.slug, type: posts.type, updatedAt: posts.updatedAt, publishedAt: posts.publishedAt,
      }).from(posts).where(and(
        eq(posts.status, "published"),
        or(isNull(posts.publishedAt), lte(posts.publishedAt, new Date())),
      )),
      db.select({ slug: projects.slug, updatedAt: projects.updatedAt })
        .from(projects).where(eq(projects.status, "published")),
    ]);

    const folders: Record<string, string> = { essay: "essays", note: "notes", research: "research" };
    const articleRoutes: MetadataRoute.Sitemap = articles
      .filter((article) => Boolean(folders[article.type]))
      .map((article) => ({
        url: `${BASE_URL}/${folders[article.type]}/${encodeURIComponent(article.slug)}`,
        lastModified: article.updatedAt ?? article.publishedAt ?? undefined,
      }));
    const projectRoutes: MetadataRoute.Sitemap = work.map((project) => ({
      url: `${BASE_URL}/projects/${encodeURIComponent(project.slug)}`,
      lastModified: project.updatedAt,
    }));
    return [...staticRoutes, ...articleRoutes, ...projectRoutes];
  } catch (error) {
    console.error("Unable to load sitemap content:", error);
    return staticRoutes;
  }
}
