import { Link } from "@tanstack/react-router";
import { HeartHandshake, Users, ClipboardList, TrendingUp, Building2, FileText } from "lucide-react";

export function CooWorkspace() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Director / COO Workspace</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Community Impact & Program Oversight</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Operational home for program delivery, partner relationships, volunteer pipelines, and community-impact reporting.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active programs", value: 4, icon: HeartHandshake },
          { label: "Partner orgs engaged", value: "—", icon: Building2 },
          { label: "Volunteers on roster", value: "—", icon: Users },
          { label: "Households served (MTD)", value: "—", icon: TrendingUp },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k.label}</span>
              <k.icon className="h-4 w-4 text-rosewood" strokeWidth={1.5} />
            </div>
            <p className="mt-3 font-display text-3xl">{k.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Program oversight checklist</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Review weekly referral pipeline & flag bottlenecks",
              "Confirm volunteer coverage for upcoming Community Drives",
              "Check Chauntae's Voice DV-support intake notes",
              "Sync with Executive Director on partner MOUs",
              "Update monthly impact report (households, meals, hours)",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rosewood" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Program areas</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Emergency Stabilization", to: "/services" },
              { label: "Chauntae's Voice (DV Support)", to: "/chauntaes-voice" },
              { label: "Feed & Clothe the Homeless", to: "/services" },
              { label: "Education", to: "/services" },
              { label: "Community Drives", to: "/food-drives" },
              { label: "Volunteer Pipeline", to: "/volunteer" },
            ].map((p) => (
              <Link key={p.label} to={p.to} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl">Quick access</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Link to="/governance" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm hover:border-rosewood/40">
            <FileText className="h-4 w-4" /> Governance
          </Link>
          <Link to="/documents" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm hover:border-rosewood/40">
            <ClipboardList className="h-4 w-4" /> Policy hub
          </Link>
          <Link to="/board" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm hover:border-rosewood/40">
            <Users className="h-4 w-4" /> Board roster
          </Link>
        </div>
      </section>
    </div>
  );
}
