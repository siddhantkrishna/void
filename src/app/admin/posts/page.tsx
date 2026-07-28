import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.updatedAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-void-white">Posts</h1>
          <p className="text-sm text-void-muted mt-1">
            Manage essays, notes, and research articles.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {allPosts.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-void-muted">No posts yet. Create your first one.</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider hidden lg:table-cell">
                  Updated
                </th>
                <th className="text-right text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allPosts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm text-void-white hover:text-void-accent transition-colors"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-[10px] uppercase tracking-wider text-void-accent bg-void-blue/10 px-2 py-0.5 rounded">
                      {post.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                        post.status === "published"
                          ? "text-green-400 bg-green-500/10"
                          : "text-yellow-400 bg-yellow-500/10"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-void-muted hidden lg:table-cell">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-xs text-void-accent hover:text-void-blue transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
