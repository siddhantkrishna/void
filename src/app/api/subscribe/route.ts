import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    let email: string;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = body.email;
    } else {
      const formData = await request.formData();
      email = formData.get("email") as string;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Valid email is required." }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      return Response.json({ message: "You're already subscribed!" });
    }

    const token = crypto.randomUUID();
    await db.insert(subscribers).values({
      email: email.toLowerCase(),
      token,
      confirmed: true,
    });

    return Response.json({ message: "Successfully subscribed! Welcome to the Void." });
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
