import Link from "next/link";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software, research, and creative projects.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(desc(projects.createdAt));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-16 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-void-white mb-4">
          Projects
        </h1>
        <p className="text-lg text-void-muted max-w-2xl">
          Things I&apos;ve built, explored, and created.
        </p>
      </div>

      {allProjects.length === 0 ? (
        <p className="text-void-muted text-sm">No projects published yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
          {allProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="glass rounded-xl p-8 hover:bg-white/5 transition-all group"
            >
              <h2 className="text-lg font-medium text-void-white group-hover:text-void-accent transition-colors mb-2">
                {project.title}
              </h2>
              {project.description && (
                <p className="text-sm text-void-muted line-clamp-3 leading-relaxed mb-4">
                  {project.description}
                </p>
              )}
              {project.techStack && Array.isArray(project.techStack) && (
                <div className="flex flex-wrap gap-1.5">
                  {(project.techStack as string[]).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] text-void-accent bg-void-blue/10 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-3">
                {project.githubUrl && (
                  <span className="text-[10px] text-void-muted">GitHub</span>
                )}
                {project.demoUrl && (
                  <span className="text-[10px] text-void-muted">Demo</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
