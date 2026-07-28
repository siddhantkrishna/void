"use client";

import { useState, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  featured: boolean;
}

export default function AdminProjectsPage() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setProjectList(data.projects || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
        status: "published",
      }),
    });
    setTitle("");
    setDescription("");
    setTechStack("");
    setSaving(false);
    fetchProjects();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-void-white mb-8">Projects</h1>

      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-void-white mb-4">Add Project</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none resize-y"
          />
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="Tech stack (comma-separated)"
            className="w-full bg-void-gray/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-void-white placeholder:text-void-muted outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={saving}
            className="bg-void-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-void-blue/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add Project"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-void-muted text-sm">Loading...</p>
      ) : projectList.length === 0 ? (
        <p className="text-void-muted text-sm">No projects yet.</p>
      ) : (
        <div className="space-y-3">
          {projectList.map((project) => (
            <div key={project.id} className="glass rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-void-white">{project.title}</h3>
                {project.description && (
                  <p className="text-xs text-void-muted mt-0.5 line-clamp-1">{project.description}</p>
                )}
              </div>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                project.status === "published" ? "text-green-400 bg-green-500/10" : "text-yellow-400 bg-yellow-500/10"
              }`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
