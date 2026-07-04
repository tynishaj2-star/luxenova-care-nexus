import { Link } from "@tanstack/react-router";
import {
  Crown,
  Users,
  ShieldCheck,
  Landmark,
  HeartHandshake,
  FileText,
  TrendingUp,
  CalendarCheck,
  Target,
  DollarSign,
  ClipboardCheck,
  Megaphone,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
  Briefcase,
} from "lucide-react";

type KPI = { label: string; value: string; sub: string; icon: typeof Crown; tone: string };

const KPIS: KPI[] = [
  { label: "Households Served (YTD)", value: "—", sub: "Pulls from intake once requests close", icon: HeartHandshake, tone: "text-rosewood" },
  { label: "Funds Deployed (YTD)", value: "$0", sub: "Direct relief + program spend", icon: DollarSign, tone: "text-emerald-700" },
  { label: "Active Partners", value: "—", sub: "Referring orgs + sponsors", icon: Users, tone: "text-sky-700" },
  { label: "Compliance Status", value: "Good Standing", sub: "501(c)(3) · EIN on file", icon: ShieldCheck, tone: "text-emerald-700" },
];

const PRIORITIES = [
  { title: "Q3 Fundraising Goal", body: "Track giving campaigns, sponsor commitments, and grant pipeline against the board-approved target.", href: "/donate", cta: "Open giving page" },
  { title: "Program Expansion — Chauntae's Voice", body: "Domestic violence safety planning rollout, advocate training, and partner MOUs in progress.", href: "/chauntaes-voice", cta: "Program page" },
  { title: "Annual Filings & Renewals", body: "990-N postcard, state charitable registration, insurance, and policy review cadence.", href: "/transparency", cta: "Transparency hub" },
  { title: "Community Drives Calendar", body: "Confirm next food / clothing drive, lead volunteer, and pickup logistics with operations.", href: "/food-drives", cta: "Drives page" },
];

const BOARD = [
  { name: "Tynisha Johnson", role: "Founder · Executive Director · President · Treasurer" },
  { name: "Trina Everett", role: "Co-Founder · Director / COO · Community Impact & Program Oversight" },
  { name: "Darien Everett", role: "Treasurer / CFO" },
  { name: "Joe Younge", role: "Events & Finance" },
  { name: "Jerez Dyer", role: "Clerk / Secretary" },
];

const GOVERNANCE = [
  { label: "Bylaws (Articles I–XV)", href: "/bylaws", icon: BookOpen },
  { label: "Conflict of Interest Policy", href: "/conflict-of-interest", icon: ShieldCheck },
  { label: "Governance Overview", href: "/governance", icon: Landmark },
  { label: "Staffing & Compensation", href: "/staffing-compensation", icon: Briefcase },
  { label: "Volunteer Policy", href: "/volunteer-policy", icon: HeartHandshake },
  { label: "HIPAA / Privacy", href: "/hipaa", icon: ShieldCheck },
  { label: "Donation Policy", href: "/donation-policy", icon: DollarSign },
  { label: "Document Hub", href: "/documents", icon: FileText },
];

const MONTHLY_CHECKLIST = [
  "Review prior-month intake metrics and partner activity",
  "Reconcile bank + donation platform with Treasurer",
  "Confirm scheduled community drive(s) staffed and supplied",
  "Send board update + any approvals needed before next meeting",
  "Audit role assignments and remove anyone no longer active",
  "Verify website policies, contact, and program pages are current",
];

const STRATEGIC_PILLARS = [
  { icon: HeartHandshake, label: "Direct Relief", body: "Emergency stabilization, food, clothing, sponsor matches." },
  { icon: ShieldCheck, label: "Safety & Advocacy", body: "Chauntae's Voice — DV safety planning + partner referrals." },
  { icon: GraduationCap, label: "Education", body: "Financial literacy, life skills, scholarship pipeline." },
  { icon: Megaphone, label: "Community Voice", body: "Awareness campaigns, listening sessions, partner convenings." },
];

export function ExecutiveDirectorSection({ firstName }: { firstName?: string | null }) {
  const displayName = firstName?.trim() || "there";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="rounded-3xl border border-border/70 bg-gradient-rosewood/5 p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-2 text-rosewood">
          <Crown className="h-4 w-4" strokeWidth={1.5} />
          <p className="text-xs uppercase tracking-[0.22em]">Executive Director Back Office</p>
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">Welcome back, {displayName}.</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Your private command center for LuxeNova Community Wellness, Inc. — organizational health,
          board oversight, compliance, programs, and the strategic priorities you're driving this quarter.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k.label}</span>
              <k.icon className={`h-4 w-4 ${k.tone}`} strokeWidth={1.5} />
            </div>
            <p className="mt-3 font-display text-2xl">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Strategic priorities */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Strategic priorities</p>
            <h2 className="mt-1 font-display text-2xl">What you're driving now</h2>
          </div>
          <Link to="/impact" className="hidden text-xs text-rosewood hover:underline sm:inline-flex items-center gap-1">
            Public impact page <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {PRIORITIES.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 text-rosewood">
                <Target className="h-4 w-4" strokeWidth={1.5} />
                <h3 className="font-display text-lg">{p.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              <Link
                to={p.href}
                className="mt-4 inline-flex items-center gap-1 text-xs text-rosewood hover:underline"
              >
                {p.cta} <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Board / leadership snapshot + Governance docs */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 text-rosewood">
            <Users className="h-4 w-4" strokeWidth={1.5} />
            <h2 className="font-display text-xl">Leadership & board</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Roster of record — keep aligned with bylaws Article III.
          </p>
          <ul className="mt-4 divide-y divide-border/60 text-sm">
            {BOARD.map((m) => (
              <li key={m.name} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/board-portal"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-rosewood px-4 py-1.5 text-xs font-medium text-rosewood-foreground shadow-luxe"
            >
              Open Board Portal <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
            <Link
              to="/board"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs hover:border-foreground/30"
            >
              Public board page
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 text-rosewood">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
            <h2 className="font-display text-xl">Governance & compliance</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            One-click access to every policy you'll be asked about in audits, grant applications, and board votes.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {GOVERNANCE.map((g) => (
              <li key={g.label}>
                <Link
                  to={g.href}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs hover:border-rosewood/40"
                >
                  <g.icon className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
                  <span className="truncate">{g.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Program pillars */}
      <section>
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Mission pillars</p>
          <h2 className="mt-1 font-display text-2xl">What we deliver</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STRATEGIC_PILLARS.map((p) => (
            <div key={p.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <p.icon className="h-5 w-5 text-rosewood" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-lg">{p.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly checklist + Risk register */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 text-rosewood">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.5} />
            <h2 className="font-display text-xl">Monthly ED checklist</h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {MONTHLY_CHECKLIST.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.5} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 text-rosewood">
            <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
            <h2 className="font-display text-xl">Watch list</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Active risks the Executive Director should track week-over-week.
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl border border-border/60 bg-background p-3">
              <p className="font-medium">Cash runway</p>
              <p className="text-xs text-muted-foreground">Confirm months of operating reserve with Treasurer monthly.</p>
            </li>
            <li className="rounded-xl border border-border/60 bg-background p-3">
              <p className="font-medium">Volunteer coverage</p>
              <p className="text-xs text-muted-foreground">Ensure every active drive has a confirmed lead.</p>
            </li>
            <li className="rounded-xl border border-border/60 bg-background p-3">
              <p className="font-medium">Partner MOUs</p>
              <p className="text-xs text-muted-foreground">Track expiration dates for referral & sponsor agreements.</p>
            </li>
            <li className="rounded-xl border border-border/60 bg-background p-3">
              <p className="font-medium">Brand & policy consistency</p>
              <p className="text-xs text-muted-foreground">All public pages reference "LuxeNova Community Wellness, Inc." in full.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Quick links */}
      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2 text-rosewood">
          <ClipboardCheck className="h-4 w-4" strokeWidth={1.5} />
          <h2 className="font-display text-xl">Quick links</h2>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/transparency", label: "Transparency & financials" },
            { to: "/nonprofit-status", label: "501(c)(3) status & EIN" },
            { to: "/impact", label: "Public impact dashboard" },
            { to: "/community-partners", label: "Community partners" },
            { to: "/sponsor-a-family", label: "Sponsor-a-family program" },
            { to: "/how-funds-are-used", label: "How funds are used" },
            { to: "/eligibility", label: "Eligibility & intake criteria" },
            { to: "/founder", label: "Founder's letter" },
            { to: "/contact", label: "Public contact page" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-3 py-2 text-xs hover:border-rosewood/40"
            >
              <span>{l.label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-rosewood/30 bg-accent/40 p-5 text-xs text-rosewood">
        <p className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          Want any of these tiles to pull live numbers (intake counts, donations, partner activity)?
          Say the word and we'll wire them to the database.
        </p>
      </div>
    </div>
  );
}
