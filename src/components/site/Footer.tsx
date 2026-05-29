import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const cols = [
    {
      title: "Explore",
      links: [
        { label: "Mission", to: "/about" as const },
        { label: "Founder", to: "/founder" as const },
        { label: "Programs", to: "/services" as const },
        { label: "Impact", to: "/impact" as const },
        { label: "Transparency", to: "/transparency" as const },
        { label: "Contact", to: "/contact" as const },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Request Help", to: "/referrals" as const },
        { label: "Chauntae's Voice (DV Support)", to: "/chauntaes-voice" as const },
        { label: "Donate", to: "/donate" as const },
        { label: "Sponsor a Family", to: "/sponsor-a-family" as const },
        { label: "Community Drives", to: "/food-drives" as const },
        { label: "Get Involved", to: "/careers" as const },
        { label: "Community Partners", to: "/community-partners" as const },
        { label: "Employee Login / Intake", to: "/portal" as const },
      ],
    },
    {
      title: "Trust",
      links: [
        { label: "Board", to: "/board" as const },
        { label: "Governance & Bylaws", to: "/governance" as const },
        { label: "Eligibility", to: "/eligibility" as const },
        { label: "FAQ", to: "/faq" as const },
        { label: "How Funds Are Used", to: "/how-funds-are-used" as const },
        { label: "Donation Policy", to: "/donation-policy" as const },
        { label: "Volunteer Policy", to: "/volunteer-policy" as const },
        { label: "Staffing & Compensation", to: "/staffing-compensation" as const },
        { label: "Document Hub (Internal)", to: "/documents" as const },
      ],
    },

    {
      title: "Legal & More",
      links: [
        { label: "Privacy Policy", to: "/privacy" as const },
        { label: "Confidentiality Notice", to: "/hipaa" as const },
        { label: "Terms of Service", to: "/terms" as const },
        { label: "Resource Hub", to: "/resources" as const },
        { label: "Updates", to: "/updates" as const },
        { label: "Nonprofit Status", to: "/nonprofit-status" as const },
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
              <span className="font-display text-lg">LuxeNova Community Wellness</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              A Massachusetts community relief and family stabilization
              initiative — built on dignity, transparency, and care.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href="tel:+18665663146" className="hover:text-rosewood transition-colors">(866) 566-3146</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:tjohnson@luxenovawellnesscommunity.com" className="hover:text-rosewood transition-colors break-all">tjohnson@luxenovawellnesscommunity.com</a></li>
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

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
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
          <p>Confidential · Community-centered · Transparent impact</p>
        </div>
      </div>
    </footer>
  );
}
