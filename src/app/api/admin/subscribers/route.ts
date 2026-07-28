import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allSubscribers = await db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.subscribedAt));

  return Response.json({ subscribers: allSubscribers });
}
