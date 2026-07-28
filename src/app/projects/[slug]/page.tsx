import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
    .limit(1);

  if (!project) return { title: "Not Found" };
  return { title: project.title, description: project.description || undefined };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
    .limit(1);

  if (!project) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <header className="mb-12 animate-fade-in-up">
        <span className="text-[10px] uppercase tracking-[0.2em] text-void-accent mb-3 block">Project</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-void-white leading-[1.15] mb-4">
          {project.title}
        </h1>
        {project.description && (
          <p className="text-lg text-void-muted leading-relaxed">{project.description}</p>
        )}
      </header>

      <div className="animate-fade-in-up animation-delay-200">
        {project.techStack && Array.isArray(project.techStack) && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-void-muted mb-3">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {(project.techStack as string[]).map((tech) => (
                <span
                  key={tech}
                  className="text-xs text-void-accent bg-void-blue/10 px-3 py-1 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-void-accent hover:text-void-blue transition-colors"
            >
              View on GitHub →
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-void-accent hover:text-void-blue transition-colors"
            >
              Live Demo →
            </a>
          )}
        </div>

        {project.contentHtml ? (
          <div
            className="prose-void"
            dangerouslySetInnerHTML={{ __html: project.contentHtml }}
          />
        ) : project.content ? (
          <div className="prose-void">
            {project.content.split("\n").map((p, i) =>
              p.trim() ? <p key={i}>{p}</p> : null
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
