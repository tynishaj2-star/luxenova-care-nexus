import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  DollarSign,
  HeartHandshake,
  FileText,
  ClipboardList,
  Gavel,
  CalendarCheck,
  BookOpenCheck,
  Users,
  TrendingUp,
  ScrollText,
  Archive,
  CheckSquare,
  PieChart,
  Briefcase,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/board-portal")({
  head: () => ({
    meta: [
      { title: "Board Portal — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Confidential board portal for LuxeNova Community Wellness founding board members. Role-based oversight, governance, financial review, and impact reporting.",
      },
    ],
  }),
  component: BoardPortalPage,
});

type Section = { title: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; description: string };

type BoardMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  sections: Section[];
};

const treasurySections: Section[] = [
  { title: "Executive Summary", icon: ShieldCheck, description: "High-level snapshot of mission, finances, and program health." },
  { title: "Financial Overview", icon: DollarSign, description: "Inflows, outflows, reserves, and runway at a glance." },
  { title: "Donation Tracking", icon: HeartHandshake, description: "Recent donations, recurring givers, and acknowledgment status." },
  { title: "Sponsor Funds", icon: Briefcase, description: "Sponsor-a-family balances and restricted-fund allocations." },
  { title: "Expense Tracking", icon: ClipboardList, description: "Categorized expenses with receipts and approval trail." },
  { title: "Requests Needing Funding", icon: TrendingUp, description: "Family stabilization requests awaiting financial match." },
  { title: "Community Impact Review", icon: PieChart, description: "Outcomes per dollar, families served, and program reach." },
  { title: "Food Drive Needs", icon: ClipboardList, description: "Upcoming drives, sponsor gaps, and inventory needs." },
  { title: "Disability & Autism Family Support Requests", icon: HeartHandshake, description: "Specialized requests requiring tailored navigation." },
  { title: "Board Documents", icon: FileText, description: "Bylaws, board packets, signed resolutions." },
  { title: "Impact Reports", icon: BookOpenCheck, description: "Quarterly and annual outcomes for funders and the public." },
  { title: "Admin Summary", icon: ShieldCheck, description: "Operational highlights from the staff intake team." },
];

const members: BoardMember[] = [
  {
    id: "tynisha",
    name: "Tynisha Johnson",
    role: "Founder / Treasurer / Community Impact & Program Oversight",
    initials: "TJ",
    sections: treasurySections,
  },
  {
    id: "trina",
    name: "Trina Everett",
    role: "Co-Founder / Treasurer / Community Impact & Program Oversight",
    initials: "TE",
    sections: treasurySections,
  },
  {
    id: "victoria",
    name: "Victoria Roscoe",
    role: "Board Chair / President",
    initials: "VR",
    sections: [
      { title: "Board Meeting Agenda", icon: CalendarCheck, description: "Upcoming agendas and circulated pre-reads." },
      { title: "Board Minutes", icon: ScrollText, description: "Approved and pending minutes for review." },
      { title: "Governance Tasks", icon: Gavel, description: "Open governance items requiring chair action." },
      { title: "Mission Updates", icon: ShieldCheck, description: "Strategic narrative for funders and partners." },
      { title: "Policy Approvals", icon: CheckSquare, description: "Policies pending board vote or ratification." },
      { title: "Board Member Tasks", icon: Users, description: "Assignments and follow-ups across the board." },
      { title: "High-Level Impact Dashboard", icon: PieChart, description: "Outcomes summary for stakeholder communication." },
      { title: "Compliance Overview", icon: ShieldCheck, description: "Filings, insurance, conflicts-of-interest log." },
      { title: "Strategic Priorities", icon: TrendingUp, description: "Annual goals, milestones, and risk tracker." },
    ],
  },
  {
    id: "latoia",
    name: "Latoia Moses",
    role: "Vice Chair / Community Impact & Program Oversight",
    initials: "LM",
    sections: [
      { title: "Family Stabilization Summary", icon: HeartHandshake, description: "Aggregate view of families currently in stabilization." },
      { title: "Program Outcomes", icon: PieChart, description: "Program-level KPIs and trend lines." },
      { title: "Food Drive Needs", icon: ClipboardList, description: "Upcoming drives and unmet inventory gaps." },
      { title: "Disability & Autism Support Requests", icon: HeartHandshake, description: "Specialized family support cases under review." },
      { title: "Partner Feedback", icon: Users, description: "Notes from churches, schools, and agencies." },
      { title: "Community Impact Reports", icon: BookOpenCheck, description: "Narrative + data reports for community sharing." },
      { title: "Program Review Tasks", icon: CheckSquare, description: "Open program review and QA assignments." },
      { title: "Resource Gaps", icon: TrendingUp, description: "Identified service gaps awaiting partner match." },
      { title: "Follow-Up Priorities", icon: ClipboardList, description: "High-priority families needing escalated follow-up." },
    ],
  },
  {
    id: "joe",
    name: "Joe Younge",
    role: "Secretary",
    initials: "JY",
    sections: [
      { title: "Board Minutes", icon: ScrollText, description: "Drafted and approved meeting minutes." },
      { title: "Meeting Records", icon: CalendarCheck, description: "Attendance, motions, and quorum logs." },
      { title: "Official Documents", icon: FileText, description: "Articles of incorporation, EIN, state filings." },
      { title: "Bylaws", icon: BookOpenCheck, description: "Current bylaws and amendment history." },
      { title: "Policies", icon: Gavel, description: "Governance policies and conflict-of-interest forms." },
      { title: "Compliance Checklist", icon: CheckSquare, description: "Ongoing nonprofit compliance items." },
      { title: "Filing Tracker", icon: ClipboardList, description: "State and federal filing due dates." },
      { title: "Board Vote Records", icon: ScrollText, description: "Recorded motions and voting outcomes." },
      { title: "Governance Calendar", icon: CalendarCheck, description: "Annual governance and reporting calendar." },
      { title: "Document Archive", icon: Archive, description: "Historical records and signed resolutions." },
    ],
  },
];

function BoardPortalPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = members.find((m) => m.id === activeId) ?? null;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
            L
          </span>
          <span className="font-display text-lg">LuxeNova Community Wellness</span>
        </Link>
        <div className="flex items-center gap-3">
          {active && (
            <button
              onClick={() => setActiveId(null)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
            >
              Switch member
            </button>
          )}
          <Link
            to="/"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-4">
        {!active ? (
          <SelectMember onPick={setActiveId} />
        ) : (
          <Dashboard member={active} />
        )}
      </main>
    </div>
  );
}

function SelectMember({ onPick }: { onPick: (id: string) => void }) {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Board Portal</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-balance">
          Confidential oversight for the LuxeNova founding board
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Select your board profile to access your role-based dashboard. Each
          view is tailored to the responsibilities you carry on behalf of
          LuxeNova Community Wellness — governance, finance, programs, and
          impact.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} /> Preview · Mock board login
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => onPick(m.id)}
            className="group flex items-start gap-4 rounded-3xl border border-border/70 bg-card p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/40 hover:shadow-luxe"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-rosewood font-display text-rosewood-foreground">
              {m.initials}
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg">{m.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-rosewood">
                {m.role}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {m.sections.length} dashboard sections
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Dashboard({ member }: { member: BoardMember }) {
  return (
    <section>
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-soft md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-rosewood font-display text-rosewood-foreground">
            {member.initials}
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Board Portal</p>
            <h1 className="font-display text-2xl md:text-3xl">{member.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
          Confidential · Board-level access
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {member.sections.map((s) => (
          <article
            key={s.title}
            className="group rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/40 hover:shadow-luxe"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood">
                <s.icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="font-display text-base">{s.title}</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{s.description}</p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Awaiting live data
            </p>
          </article>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Data shown here will populate from the LuxeNova operations backend once
        board accounts are activated. This preview confirms each member's
        role-based view.
      </p>
    </section>
  );
}
