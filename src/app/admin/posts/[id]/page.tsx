"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  type: string;
  status: string;
  featured: boolean;
  pinned: boolean;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [type, setType] = useState("essay");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          setPost(data.post);
          setTitle(data.post.title);
          setContent(data.post.content || "");
          setExcerpt(data.post.excerpt || "");
          setType(data.post.type);
          setStatus(data.post.status);
          setFeatured(data.post.featured || false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 238));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt, type, status, featured }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.push("/admin/posts");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-void-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-void-muted text-sm">Post not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-void-white">Edit Post</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-void-muted">
            {wordCount} words · {readingTime} min read
          </span>
          <label className="flex items-center gap-2 text-xs text-void-muted cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-void-gray"
            />
            Featured
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-void-gray border border-white/10 rounded-lg px-3 py-2 text-xs text-void-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-2"
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-void-gray border border-white/10 rounded-lg px-3 py-2 text-sm text-void-white"
        >
          <option value="essay">Essay</option>
          <option value="note">Note</option>
          <option value="research">Research</option>
          <option value="journal">Journal</option>
        </select>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent text-3xl font-bold text-void-white placeholder:text-void-gray outline-none"
        />

        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Excerpt..."
          className="w-full bg-transparent text-base text-void-muted placeholder:text-void-gray outline-none"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          rows={30}
          className="w-full bg-void-gray/30 border border-white/5 rounded-xl p-6 text-base text-void-light placeholder:text-void-gray outline-none focus:border-void-blue/20 transition-colors resize-y leading-relaxed"
        />
      </div>
    </div>
  );
}
