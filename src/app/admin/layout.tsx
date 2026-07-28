import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import type { ReactNode } from "react";
import AdminSidebar from "./components/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userName={user.name} userRole={user.role} />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
