import { db } from "@/db";
import { projects } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { desc } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allProjects = await db.select().from(projects).orderBy(desc(projects.updatedAt));
  return Response.json({ projects: allProjects });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, content, techStack, githubUrl, demoUrl, status = "draft", featured } = body;

  if (!title) {
    return Response.json({ error: "Title is required." }, { status: 400 });
  }

  const [project] = await db
    .insert(projects)
    .values({
      title,
      slug: slugify(title),
      description,
      content,
      contentHtml: content
        ? content.split("\n").map((p: string) => (p.trim() ? `<p>${p.trim()}</p>` : "")).join("\n")
        : null,
      techStack: techStack || [],
      githubUrl,
      demoUrl,
      status,
      featured: featured || false,
      publishedAt: status === "published" ? new Date() : null,
    })
    .returning();

  return Response.json({ project });
}
