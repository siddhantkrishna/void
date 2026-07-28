"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SearchModal from "./search-modal";

const links = [
  { href: "/", label: "Home" },
  { href: "/essays", label: "Essays" },
  { href: "/notes", label: "Notes" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/books", label: "Books" },
  { href: "/quotes", label: "Quotes" },
  { href: "/about", label: "About" },
];

export default function Navbar({ isAdmin }: { isAdmin?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-sm font-semibold tracking-wider text-void-white hover:text-void-accent transition-colors"
            >
              VOID
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {links.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs tracking-wide text-void-muted hover:text-void-white transition-colors uppercase"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-xs tracking-wide text-void-muted hover:text-void-white transition-colors uppercase flex items-center gap-1"
                aria-label="Search"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden lg:inline">⌘K</span>
              </button>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-xs tracking-wide bg-void-blue/20 text-void-accent px-3 py-1.5 rounded-full hover:bg-void-blue/30 transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-void-muted hover:text-void-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass border-t border-white/5">
            <div className="px-4 py-3 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-void-muted hover:text-void-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="block py-2 text-sm text-void-muted hover:text-void-white transition-colors w-full text-left"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
