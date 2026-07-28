import { db } from "@/db";
import { books } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { desc } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allBooks = await db.select().from(books).orderBy(desc(books.createdAt));
  return Response.json({ books: allBooks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, author, notes, rating, status = "read" } = body;

  if (!title || !author) {
    return Response.json({ error: "Title and author are required." }, { status: 400 });
  }

  const [book] = await db
    .insert(books)
    .values({
      title,
      author,
      slug: slugify(title),
      notes,
      rating: rating || null,
      status,
      featured: true,
    })
    .returning();

  return Response.json({ book });
}
