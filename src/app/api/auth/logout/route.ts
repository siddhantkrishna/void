import { logout } from "@/lib/auth";

export async function POST() {
  await logout();
  return Response.json({ success: true });
}
