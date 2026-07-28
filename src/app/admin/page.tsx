import { db } from "@/db";
import { posts, projects, subscribers, pageViews, quotes, books } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [[postCount], [publishedCount], [draftCount], [projectCount], [subscriberCount], [quoteCount], [bookCount]] =
    await Promise.all([
      db.select({ value: count() }).from(posts),
      db.select({ value: count() }).from(posts).where(eq(posts.status, "published")),
      db.select({ value: count() }).from(posts).where(eq(posts.status, "draft")),
      db.select({ value: count() }).from(projects),
      db.select({ value: count() }).from(subscribers),
      db.select({ value: count() }).from(quotes),
      db.select({ value: count() }).from(books),
    ]);

  const stats = [
    { label: "Total Posts", value: postCount.value, href: "/admin/posts" },
    { label: "Published", value: publishedCount.value, href: "/admin/posts" },
    { label: "Drafts", value: draftCount.value, href: "/admin/posts" },
    { label: "Projects", value: projectCount.value, href: "/admin/projects" },
    { label: "Subscribers", value: subscriberCount.value, href: "/admin/subscribers" },
    { label: "Quotes", value: quoteCount.value, href: "/admin/quotes" },
    { label: "Books", value: bookCount.value, href: "/admin/books" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-void-white">Dashboard</h1>
          <p className="text-sm text-void-muted mt-1">Welcome to the Void CMS.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass rounded-xl p-5 hover:bg-white/5 transition-colors group"
          >
            <p className="text-3xl font-bold text-void-white group-hover:text-void-accent transition-colors">
              {stat.value}
            </p>
            <p className="text-xs text-void-muted mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-sm font-semibold text-void-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/admin/posts/new", label: "Write Essay", desc: "Create a new long-form essay" },
            { href: "/admin/posts/new?type=note", label: "Write Note", desc: "Jot down a quick thought" },
            { href: "/admin/posts/new?type=research", label: "Add Research", desc: "Publish research findings" },
            { href: "/admin/projects", label: "Manage Projects", desc: "Add or edit projects" },
            { href: "/admin/quotes", label: "Add Quote", desc: "Save a resonant quote" },
            { href: "/admin/subscribers", label: "View Subscribers", desc: "Manage newsletter list" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="p-4 rounded-lg border border-white/5 hover:border-void-blue/20 hover:bg-white/5 transition-colors group"
            >
              <p className="text-sm font-medium text-void-white group-hover:text-void-accent transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-void-muted mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
