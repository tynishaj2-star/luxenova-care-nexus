import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const mainLinks = [
  { label: "Home", to: "/" as const },
  { label: "About", to: "/about" as const },
  { label: "Services", to: "/services" as const },
  { label: "Insurance", to: "/insurance" as const },
  { label: "Referrals", to: "/referrals" as const },
  { label: "Contact", to: "/contact" as const },
];

const moreLinks = [
  { label: "Careers", to: "/careers" as const },
  { label: "Privacy Policy", to: "/privacy" as const },
  { label: "HIPAA Notice", to: "/hipaa" as const },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

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
          ? "bg-background/85 backdrop-blur-md border-b border-border/60"
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

        <nav className="hidden items-center gap-7 lg:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full w-56 pt-3">
                <div className="rounded-2xl border border-border/70 bg-card p-2 shadow-luxe">
                  {moreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="block rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition hover:bg-accent hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/referrals"
            className="hidden rounded-full bg-gradient-rosewood px-5 py-2.5 text-sm font-medium text-rosewood-foreground shadow-soft transition hover:opacity-95 sm:inline-flex"
          >
            Submit Referral
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setOpen((p) => !p)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex flex-col gap-1">
              {[...mainLinks, ...moreLinks].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-foreground/85 transition hover:bg-accent"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
