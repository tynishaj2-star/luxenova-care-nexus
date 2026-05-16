import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Why Us", href: "/#why" },
  { label: "Partners", href: "/#partners" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display text-base">
            L
          </span>
          <span className="font-display text-lg tracking-tight">
            LuxeNova<span className="text-muted-foreground"> · Wellness</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/portal"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Portal
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/referral"
            className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-soft transition hover:border-foreground/30 sm:inline-flex"
          >
            Submit Referral
          </Link>
          <Link
            to="/referral"
            className="inline-flex items-center rounded-full bg-gradient-rosewood px-5 py-2.5 text-sm font-medium text-rosewood-foreground shadow-soft transition hover:opacity-95"
          >
            Request Services
          </Link>
        </div>
      </div>
    </header>
  );
}
