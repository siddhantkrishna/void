"use client";

import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export default function AdminCategoriesPage() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategoryList(data.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    setSaving(false);
    fetchCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-void-white mb-8">Categories</h1>

      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-void-white mb-4">Add Category</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={saving}
            className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-void-muted text-sm">Loading...</p>
      ) : categoryList.length === 0 ? (
        <p className="text-void-muted text-sm">No categories yet.</p>
      ) : (
        <div className="space-y-3">
          {categoryList.map((cat) => (
            <div key={cat.id} className="glass rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-void-white">{cat.name}</h3>
                {cat.description && (
                  <p className="text-xs text-void-muted mt-0.5">{cat.description}</p>
                )}
              </div>
              <span className="text-xs text-void-muted">{cat.slug}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
