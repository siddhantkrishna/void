import Link from "next/link";

const footerLinks = [
  { href: "/essays", label: "Essays" },
  { href: "/notes", label: "Notes" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/books", label: "Books" },
  { href: "/quotes", label: "Quotes" },
  { href: "/about", label: "About" },
  { href: "/rss.xml", label: "RSS" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 mt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-void-white mb-4">
              SIDDHANT&shy;KRISHNA&rsquo;S VOID
            </h3>
            <p className="text-xs text-void-muted leading-relaxed">
              Thoughts at the edge of technology, philosophy, intelligence, and the future.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-void-muted mb-4">
              Navigate
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-void-muted hover:text-void-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-void-muted mb-4">
              Subscribe
            </h3>
            <p className="text-xs text-void-muted mb-3">
              Get new essays delivered to your inbox.
            </p>
            <form action="/api/subscribe" method="POST" className="flex gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="flex-1 bg-void-gray/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-void-white placeholder:text-void-muted outline-none focus:border-void-blue/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-void-blue/20 text-void-accent text-xs px-4 py-2 rounded-lg hover:bg-void-blue/30 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] text-void-muted">
            © {new Date().getFullYear()} SiddhantKrishna. All rights reserved. Built with Next.js, crafted in the void.
          </p>
        </div>
      </div>
    </footer>
  );
}
