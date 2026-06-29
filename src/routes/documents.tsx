import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  Scale,
  HandCoins,
  Users,
  HeartHandshake,
  FileText,
  ClipboardCheck,
  BookOpen,
  Landmark,
  FileLock2,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Internal Document Hub — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Internal staff hub: policies, compliance documents, and confidentiality references for LuxeNova Community Wellness, Inc. navigators, volunteers, and board members.",
      },
      { property: "og:title", content: "Internal Document Hub — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content:
          "Quick access to staffing, compliance, confidentiality, and governance policies.",
      },
    ],
  }),
  component: DocumentsHub,
});

type Doc = {
  title: string;
  body: string;
  to:
    | "/staffing-compensation"
    | "/hipaa"
    | "/privacy"
    | "/terms"
    | "/donation-policy"
    | "/volunteer-policy"
    | "/how-funds-are-used"
    | "/transparency"
    | "/nonprofit-status"
    | "/eligibility"
    | "/board"
    | "/insurance"
    | "/bylaws"
    | "/conflict-of-interest"
    | "/governance";

  icon: typeof ShieldCheck;
  meta: string;
  tags: string[];
};

const sections: { id: string; title: string; description: string; docs: Doc[] }[] = [
  {
    id: "people",
    title: "People & Compensation",
    description:
      "Policies governing how LuxeNova staff and volunteers are engaged, paid, and protected.",
    docs: [
      {
        title: "Staffing & Compensation",
        body: "How paid roles are created, reasonable compensation, board approval, classification, and payroll compliance.",
        to: "/staffing-compensation",
        icon: HandCoins,
        meta: "Internal Policy",
        tags: ["staff", "payroll", "board"],
      },
      {
        title: "Volunteer Policy",
        body: "Volunteer expectations, screening, confidentiality, and scope of role within community programs.",
        to: "/volunteer-policy",
        icon: Users,
        meta: "Internal Policy",
        tags: ["volunteer", "conduct"],
      },
      {
        title: "Insurance & Liability",
        body: "Coverage in place to protect families, partners, volunteers, and the organization during programming.",
        to: "/insurance",
        icon: ShieldCheck,
        meta: "Risk & Coverage",
        tags: ["insurance", "liability", "safety"],
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance & Confidentiality",
    description:
      "Handling of household information, protected health information, and consent for service coordination.",
    docs: [
      {
        title: "Confidentiality Notice (HIPAA-aware)",
        body: "How LuxeNova handles Protected Health Information, releases of information, and confidential household data.",
        to: "/hipaa",
        icon: Lock,
        meta: "Confidentiality",
        tags: ["hipaa", "phi", "confidential"],
      },
      {
        title: "Privacy Policy",
        body: "What we collect, why we collect it, how we store it, and the rights families and partners have over their data.",
        to: "/privacy",
        icon: FileLock2,
        meta: "Privacy",
        tags: ["privacy", "data"],
      },
      {
        title: "Terms of Service",
        body: "Use of LuxeNova's site, portal, and intake tools by families, partners, and staff.",
        to: "/terms",
        icon: Scale,
        meta: "Legal",
        tags: ["terms", "legal"],
      },
    ],
  },
  {
    id: "governance",
    title: "Governance & Financial Stewardship",
    description:
      "Board oversight, nonprofit status, donor stewardship, and documented use of funds.",
    docs: [
      {
        title: "Board of Directors",
        body: "Founding board roles, responsibilities, and governance structure for mission protection and oversight.",
        to: "/board",
        icon: Landmark,
        meta: "Governance",
        tags: ["board", "governance", "oversight"],
      },
      {
        title: "Bylaws",
        body: "Full adopted bylaws — purpose, board structure, officers, meetings, finances, conflicts, indemnification, amendments, and dissolution.",
        to: "/bylaws",
        icon: Scale,
        meta: "Governance",
        tags: ["bylaws", "governance", "board"],
      },
      {
        title: "Conflict of Interest Policy",
        body: "Disclosure, recusal, and annual disclosure form for directors, officers, and key personnel.",
        to: "/conflict-of-interest",
        icon: FileText,
        meta: "Governance",
        tags: ["conflict", "ethics", "disclosure"],
      },
      {
        title: "Governance Overview",
        body: "Governance framework, financial controls, recordkeeping, and policy development summary.",
        to: "/governance",
        icon: Landmark,
        meta: "Governance",
        tags: ["governance", "overview"],
      },

      {
        title: "Nonprofit Status",
        body: "Organizational formation, EIN, and 501(c)(3) standing — what's on file and how to verify.",
        to: "/nonprofit-status",
        icon: ClipboardCheck,
        meta: "Compliance",
        tags: ["nonprofit", "irs", "status"],
      },
      {
        title: "Donation Policy",
        body: "Acceptance, acknowledgment, restrictions, refunds, and conflicts of interest related to giving.",
        to: "/donation-policy",
        icon: HeartHandshake,
        meta: "Stewardship",
        tags: ["donation", "policy"],
      },
      {
        title: "How Funds Are Used",
        body: "Allocation philosophy: direct family relief, program operations, and administrative stewardship.",
        to: "/how-funds-are-used",
        icon: BookOpen,
        meta: "Financial",
        tags: ["funds", "allocation"],
      },
      {
        title: "Transparency",
        body: "Public-facing accountability — impact reporting, financial transparency, and board minutes when applicable.",
        to: "/transparency",
        icon: FileText,
        meta: "Accountability",
        tags: ["transparency", "reporting"],
      },
    ],
  },
  {
    id: "programs",
    title: "Program & Service Policies",
    description:
      "Eligibility criteria and operating standards for the stabilization programs LuxeNova runs.",
    docs: [
      {
        title: "Eligibility",
        body: "Who LuxeNova serves, prioritization, geographic scope, and how requests are reviewed.",
        to: "/eligibility",
        icon: ClipboardCheck,
        meta: "Program",
        tags: ["eligibility", "program"],
      },
    ],
  },
];

function DocumentsHub() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredSections = sections
    .map((s) => ({
      ...s,
      docs: s.docs.filter(
        (d) =>
          !q ||
          d.title.toLowerCase().includes(q) ||
          d.body.toLowerCase().includes(q) ||
          d.tags.some((t) => t.includes(q)),
      ),
    }))
    .filter((s) => s.docs.length > 0);

  const totalDocs = sections.reduce((n, s) => n + s.docs.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Internal Document Hub"
          title="Policies, compliance & confidentiality"
          description={`One place for LuxeNova staff, volunteers, and board members to access the ${totalDocs} core policies that guide our work — from HIPAA-aware confidentiality to staffing, governance, and donor stewardship.`}
        />

        {/* Search + jump nav */}
        <section className="pb-10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative md:w-96">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search policies (HIPAA, payroll, donations…)"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
                  />
                </div>
                <nav className="flex flex-wrap gap-1.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 transition hover:border-rosewood/40 hover:text-rosewood"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rosewood" strokeWidth={1.5} />
                Internal-facing hub. Public visitors see only published versions of each policy — confidential details remain restricted.
              </p>
            </div>
          </div>
        </section>

        {/* Sections */}
        {filteredSections.length === 0 && (
          <div className="mx-auto max-w-6xl px-6 pb-20">
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No policies match "{query}".
            </div>
          </div>
        )}

        {filteredSections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28 pb-14">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl">{section.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <span className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground md:inline">
                  {section.docs.length} {section.docs.length === 1 ? "document" : "documents"}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.docs.map((d) => (
                  <Link
                    key={d.title}
                    to={d.to}
                    className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
                  >
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-rosewood/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-start justify-between">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                        <d.icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/70" strokeWidth={1.5} />
                    </div>
                    <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-rosewood/80">
                      {d.meta}
                    </p>
                    <h3 className="mt-2 font-display text-xl">{d.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {d.body}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-rosewood opacity-0 transition-opacity group-hover:opacity-100">
                      Open document →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Confidentiality footer callout */}
        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-3xl border border-rosewood/30 bg-accent/40 p-7 shadow-soft md:p-8">
              <div className="flex items-start gap-4">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-rosewood" strokeWidth={1.5} />
                <div className="space-y-2 text-sm leading-relaxed text-foreground/85">
                  <p className="font-medium text-foreground">Confidentiality reminder</p>
                  <p>
                    These policies guide how LuxeNova Community Wellness, Inc. handles household information,
                    Protected Health Information (PHI), staff compensation, donor data, and board governance.
                    Staff and volunteers are expected to review them at onboarding and whenever updates are issued.
                    Specific salaries, individual donor records, and household case details remain confidential
                    and are never shared outside authorized navigators and the board.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
