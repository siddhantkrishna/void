import Link from "next/link";
import { db } from "@/db";
import { posts, projects, quotes } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import NewsletterForm from "@/components/newsletter-form";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [essays, notes, recentProjects, featuredQuotes] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(and(eq(posts.type, "essay"), eq(posts.status, "published")))
      .orderBy(desc(posts.publishedAt))
      .limit(5),
    db
      .select()
      .from(posts)
      .where(and(eq(posts.type, "note"), eq(posts.status, "published")))
      .orderBy(desc(posts.publishedAt))
      .limit(4),
    db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(desc(projects.createdAt))
      .limit(3),
    db
      .select()
      .from(quotes)
      .where(eq(quotes.featured, true))
      .limit(3),
  ]);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-void-white mb-6 leading-[1.1]">
            SiddhantKrishna&rsquo;s
            <br />
            <span className="bg-gradient-to-r from-void-blue to-void-purple bg-clip-text text-transparent">
              Void
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-void-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
            Thoughts on intelligence, technology, startups, philosophy,
            robotics, AI, civilization, and the future.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link
              href="/essays"
              className="bg-void-blue text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-void-blue/80 transition-colors"
            >
              Read Essays
            </Link>
            <Link
              href="/notes"
              className="glass text-void-white text-sm font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Explore Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Essays */}
      {essays.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-void-muted">
              Latest Essays
            </h2>
            <Link
              href="/essays"
              className="text-xs text-void-accent hover:text-void-blue transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-1">
            {essays.map((essay) => (
              <Link
                key={essay.id}
                href={`/essays/${essay.slug}`}
                className="block group py-6 border-b border-white/5 hover:border-void-blue/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-medium text-void-white group-hover:text-void-accent transition-colors">
                    {essay.title}
                  </h3>
                  <span className="text-xs text-void-muted shrink-0">
                    {formatDate(essay.publishedAt)}
                  </span>
                </div>
                {essay.excerpt && (
                  <p className="mt-2 text-sm text-void-muted leading-relaxed line-clamp-2">
                    {essay.excerpt}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-void-muted">
                  {essay.readingTime && essay.readingTime > 0 && (
                    <span>{essay.readingTime} min read</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Notes */}
      {notes.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-void-muted">
              Notes
            </h2>
            <Link
              href="/notes"
              className="text-xs text-void-accent hover:text-void-blue transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className="glass rounded-xl p-6 hover:bg-white/5 transition-colors group"
              >
                <h3 className="text-sm font-medium text-void-white group-hover:text-void-accent transition-colors mb-2">
                  {note.title}
                </h3>
                {note.excerpt && (
                  <p className="text-xs text-void-muted line-clamp-3 leading-relaxed">
                    {note.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {recentProjects.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-void-muted">
              Projects
            </h2>
            <Link
              href="/projects"
              className="text-xs text-void-accent hover:text-void-blue transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="glass rounded-xl p-6 hover:bg-white/5 transition-colors group"
              >
                <h3 className="text-sm font-medium text-void-white group-hover:text-void-accent transition-colors mb-2">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-xs text-void-muted line-clamp-2 leading-relaxed mb-3">
                    {project.description}
                  </p>
                )}
                {project.techStack && Array.isArray(project.techStack) && (
                  <div className="flex flex-wrap gap-1">
                    {(project.techStack as string[]).slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] text-void-accent bg-void-blue/10 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quotes */}
      {featuredQuotes.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-void-muted mb-10 text-center">
            Resonance
          </h2>
          <div className="space-y-8">
            {featuredQuotes.map((quote) => (
              <blockquote
                key={quote.id}
                className="text-center max-w-2xl mx-auto"
              >
                <p className="text-lg sm:text-xl text-void-light italic leading-relaxed">
                  &ldquo;{quote.text}&rdquo;
                </p>
                {quote.author && (
                  <footer className="mt-3 text-xs text-void-muted">
                    — {quote.author}
                    {quote.source && <>, {quote.source}</>}
                  </footer>
                )}
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <NewsletterForm />
      </section>
    </div>
  );
}
