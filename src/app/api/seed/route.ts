import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    await seedDatabase();
    return Response.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
