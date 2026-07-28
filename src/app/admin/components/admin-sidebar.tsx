"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "◆" },
  { href: "/admin/posts", label: "Posts", icon: "✎" },
  { href: "/admin/projects", label: "Projects", icon: "⬡" },
  { href: "/admin/quotes", label: "Quotes", icon: "❝" },
  { href: "/admin/books", label: "Books", icon: "📖" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "✉" },
  { href: "/admin/categories", label: "Categories", icon: "⊞" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminSidebar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-20 left-4 z-50 glass rounded-lg p-2 text-void-muted hover:text-void-white"
        aria-label="Toggle admin menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 w-64 glass border-r border-white/5 z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-sm font-semibold text-void-white">Void CMS</h2>
            <p className="text-[11px] text-void-muted mt-1">
              {userName} · {userRole}
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  pathname === item.href
                    ? "bg-void-blue/20 text-void-accent"
                    : "text-void-muted hover:text-void-white hover:bg-white/5"
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-void-muted hover:text-void-white hover:bg-white/5 transition-colors mb-1"
            >
              ← View Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-void-muted hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
