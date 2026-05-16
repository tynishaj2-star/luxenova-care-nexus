import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const cols = [
    {
      title: "Explore",
      links: [
        { label: "About", to: "/about" as const },
        { label: "Services", to: "/services" as const },
        { label: "Insurance", to: "/insurance" as const },
        { label: "Contact", to: "/contact" as const },
      ],
    },
    {
      title: "Partners",
      links: [
        { label: "Submit a Referral", to: "/referrals" as const },
        { label: "Become a Partner", to: "/contact" as const },
        { label: "Careers", to: "/careers" as const },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/privacy" as const },
        { label: "HIPAA Notice", to: "/hipaa" as const },
        { label: "Terms of Service", to: "/terms" as const },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/70 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
                L
              </span>
              <span className="font-display text-lg">LuxeNova · Wellness</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              Compassionate community-based care, organized with the discipline
              of modern healthcare.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (617) 555-0142</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@luxenova.care</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Greater Boston · Statewide MA</li>
            </ul>
            <div className="mt-6 flex items-center gap-2">
              {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-rosewood hover:text-rosewood"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="font-display text-sm text-foreground">{c.title}</h4>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="transition hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} LuxeNova Community Wellness. All rights reserved.</p>
          <p>HIPAA-aligned · Confidential · Trauma-informed</p>
        </div>
      </div>
    </footer>
  );
}
