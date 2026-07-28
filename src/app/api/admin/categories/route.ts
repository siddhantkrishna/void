import { db } from "@/db";
import { categories } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { desc } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
  return Response.json({ categories: allCategories });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description } = body;

  if (!name) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }

  const [category] = await db
    .insert(categories)
    .values({
      name,
      slug: slugify(name),
      description: description || null,
    })
    .returning();

  return Response.json({ category });
}
