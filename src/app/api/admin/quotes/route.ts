import { db } from "@/db";
import { quotes } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allQuotes = await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  return Response.json({ quotes: allQuotes });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { text, author, source, featured } = body;

  if (!text) {
    return Response.json({ error: "Quote text is required." }, { status: 400 });
  }

  const [quote] = await db
    .insert(quotes)
    .values({ text, author, source, featured: featured || false })
    .returning();

  return Response.json({ quote });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  await db.delete(quotes).where(eq(quotes.id, id));
  return Response.json({ success: true });
}
