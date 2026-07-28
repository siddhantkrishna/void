"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") || "essay";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [type, setType] = useState(defaultType);
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 238));

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt, type, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-void-white">New Post</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-void-muted">
            {wordCount} words · {readingTime} min read
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-void-gray border border-white/10 rounded-lg px-3 py-2 text-xs text-void-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-4">
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
        </div>

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
          placeholder="Brief excerpt or subtitle..."
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
