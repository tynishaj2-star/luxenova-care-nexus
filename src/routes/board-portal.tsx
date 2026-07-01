import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Wallet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/board-portal")({
  head: () => ({
    meta: [
      { title: "Board Portal — LuxeNova Community Wellness, Inc." },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Confidential board portal for LuxeNova Community Wellness, Inc. founding board members.",
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

const governanceSections: Section[] = [
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
];

const members: BoardMember[] = [
  {
    id: "tynisha",
    name: "Tynisha Johnson",
    role: "Founder / President / Executive Director / Officer",
    initials: "TJ",
    sections: treasurySections,
  },
  {
    id: "trina",
    name: "Trina Everett",
    role: "Director",
    initials: "TE",
    sections: [
      { title: "Family Stabilization Summary", icon: HeartHandshake, description: "Aggregate view of families currently in stabilization." },
      { title: "Program Outcomes", icon: PieChart, description: "Program-level KPIs and trend lines." },
      { title: "Community Impact Reports", icon: BookOpenCheck, description: "Narrative + data reports for community sharing." },
      { title: "Partner Feedback", icon: Users, description: "Notes from churches, schools, and agencies." },
      { title: "Program Review Tasks", icon: CheckSquare, description: "Open program review and QA assignments." },
      { title: "Resource Gaps", icon: TrendingUp, description: "Identified service gaps awaiting partner match." },
    ],
  },
  {
    id: "darien",
    name: "Darien Everett",
    role: "Treasurer / Officer / Director",
    initials: "DE",
    sections: treasurySections,
  },
  {
    id: "jerez",
    name: "Jerez Dyer",
    role: "Secretary / Clerk / SOC Signatory / Officer / Director",
    initials: "JD",
    sections: governanceSections,
  },
  {
    id: "mary",
    name: "Mary Powell",
    role: "Assistant Clerk / Assistant Secretary",
    initials: "MP",
    sections: [
      { title: "Meeting Records", icon: CalendarCheck, description: "Assist with attendance, motions, and quorum logs." },
      { title: "Board Minutes", icon: ScrollText, description: "Support drafting and circulating minutes." },
      { title: "Document Archive", icon: Archive, description: "Help maintain the historical records archive." },
      { title: "Filing Tracker", icon: ClipboardList, description: "Support state and federal filing calendar." },
      { title: "Policies", icon: Gavel, description: "Assist Secretary with policy tracking and updates." },
    ],
  },
];

type AuthStatus =
  | { state: "loading" }
  | { state: "unauthenticated" }
  | { state: "unauthorized"; email: string | null }
  | { state: "authorized"; memberKey: string };

function BoardPortalPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelled) setStatus({ state: "unauthenticated" });
        return;
      }
      const { data, error } = await supabase
        .from("board_members")
        .select("member_key")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setStatus({ state: "unauthorized", email: session.user.email ?? null });
      } else {
        setStatus({ state: "authorized", memberKey: data.member_key });
      }
    }
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => check());
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  if (status.state === "loading") {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-warm">
        <p className="text-sm text-muted-foreground">Verifying board access…</p>
      </div>
    );
  }

  if (status.state === "unauthenticated") {
    return (
      <Gate
        title="Board sign-in required"
        body="This portal is restricted to LuxeNova Community Wellness, Inc. founding board members. Please sign in to continue."
        primary={{ label: "Sign in", onClick: () => navigate({ to: "/login" }) }}
      />
    );
  }

  if (status.state === "unauthorized") {
    return (
      <Gate
        title="Access not authorized"
        body={`The account ${status.email ?? ""} is signed in but is not provisioned as a board member. Contact the LuxeNova administrator to request board portal access.`}
        primary={{
          label: "Sign out",
          onClick: async () => {
            await supabase.auth.signOut();
          },
        }}
      />
    );
  }

  const member = members.find((m) => m.id === status.memberKey);
  if (!member) {
    return (
      <Gate
        title="Board profile not configured"
        body="Your account is recognized but no matching board profile is set up. Contact the LuxeNova administrator."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
            L
          </span>
          <span className="font-display text-lg">LuxeNova Community Wellness, Inc.</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
          >
            Sign out
          </button>
          <Link
            to="/"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
          >
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-4">
        <Dashboard member={member} />
      </main>
    </div>
  );
}

function Gate({
  title,
  body,
  primary,
}: {
  title: string;
  body: string;
  primary?: { label: string; onClick: () => void };
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-warm px-6">
      <div className="max-w-md rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/60 text-rosewood">
          <Lock className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <h1 className="mt-5 font-display text-2xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex justify-center gap-3">
          {primary && (
            <button
              onClick={primary.onClick}
              className="rounded-full bg-gradient-rosewood px-5 py-2 text-sm text-rosewood-foreground shadow-luxe"
            >
              {primary.label}
            </button>
          )}
          <Link
            to="/"
            className="rounded-full border border-border bg-background px-5 py-2 text-sm text-foreground"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
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
    </section>
  );
}
