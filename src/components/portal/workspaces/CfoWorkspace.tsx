import { Link } from "@tanstack/react-router";
import { DollarSign, Wallet, Receipt, PiggyBank, FileText, ShieldCheck, ArrowRight } from "lucide-react";

export function CfoWorkspace() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Treasurer / CFO Workspace</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Treasury & Financial Stewardship</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Cash position, donations, grants, expenses, and compliance — everything needed to keep LuxeNova's 501(c)(3) finances clean and audit-ready.
        </p>
        <Link to="/board-portal/cfo" className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-5 py-2.5 text-sm text-rosewood-foreground shadow-luxe">
          Open Treasurer back office <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Operating cash", value: "—", icon: Wallet },
          { label: "Donations (MTD)", value: "—", icon: DollarSign },
          { label: "Grants pending", value: "—", icon: PiggyBank },
          { label: "Expenses (MTD)", value: "—", icon: Receipt },
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
          <h2 className="font-display text-xl">Monthly treasury checklist</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Reconcile bank & Givebutter deposits",
              "Categorize expenses against program budgets",
              "Issue donor acknowledgement letters (>$250)",
              "Update donor restricted-fund ledger",
              "File state quarterly reports (if due)",
              "Send finance summary to Executive Director",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rosewood" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Compliance & filings</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { label: "IRS Form 990-N e-Postcard", due: "Annual — due 5/15" },
              { label: "MA Form PC (AG Charities)", due: "Annual" },
              { label: "MA Annual Report", due: "Anniversary month" },
              { label: "Conflict of Interest disclosures", due: "Annual" },
              { label: "Board-approved budget", due: "Start of fiscal year" },
            ].map((f) => (
              <li key={f.label} className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
                <span>{f.label}</span>
                <span className="text-xs text-muted-foreground">{f.due}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl">Quick access</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Link to="/nonprofit-status" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm hover:border-rosewood/40">
            <ShieldCheck className="h-4 w-4" /> 501(c)(3) status
          </Link>
          <Link to="/governance" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm hover:border-rosewood/40">
            <FileText className="h-4 w-4" /> Governance & bylaws
          </Link>
          <Link to="/documents" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm hover:border-rosewood/40">
            <FileText className="h-4 w-4" /> Policy hub
          </Link>
        </div>
      </section>
    </div>
  );
}
