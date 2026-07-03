import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { DollarSign, PieChart, ScrollText, Archive, Layers } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/reports")({
  head: () => ({ meta: [{ title: "Reports Hub — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ReportsHub,
});

function ReportsHub() {
  const [stats, setStats] = useState({ donations: 0, expenses: 0, grants: 0, programs: 0 });
  useEffect(() => {
    (async () => {
      const [d, e, g, p] = await Promise.all([
        supabase.from("donations").select("amount"),
        supabase.from("expenses").select("amount"),
        supabase.from("grants").select("amount_awarded"),
        supabase.from("programs").select("id", { count: "exact", head: true }),
      ]);
      const sum = (r: { amount?: number | null; amount_awarded?: number | null }[] | null, k: "amount"|"amount_awarded") =>
        (r ?? []).reduce((s, x) => s + Number(x[k] ?? 0), 0);
      setStats({
        donations: sum(d.data as any, "amount"),
        expenses: sum(e.data as any, "amount"),
        grants: sum(g.data as any, "amount_awarded"),
        programs: p.count ?? 0,
      });
    })();
  }, []);

  const tiles = [
    { to: "/board-portal/ed/financial-reports", label: "Financial Reports", desc: "Donations, expenses, net position.", icon: DollarSign },
    { to: "/board-portal/ed/programs", label: "Program Outcomes", desc: "Participants, outcomes, budgets.", icon: Layers },
    { to: "/board-portal/ed/audit", label: "Audit Log", desc: "System-wide activity trail.", icon: Archive },
    { to: "/board-portal/ed/donations", label: "Donation Ledger", desc: "Full donation history.", icon: ScrollText },
  ] as const;

  return (
    <WorkspacePage title="Reports Hub" subtitle="Snapshot of org-wide performance with links to detailed reports.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Donations" value={`$${stats.donations.toFixed(2)}`} />
        <Stat label="Total Expenses" value={`$${stats.expenses.toFixed(2)}`} />
        <Stat label="Grants Awarded" value={`$${stats.grants.toFixed(2)}`} />
        <Stat label="Active Programs" value={String(stats.programs)} />
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/40 hover:shadow-luxe">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood"><t.icon className="h-5 w-5" strokeWidth={1.5} /></span>
              <h3 className="font-display text-base">{t.label}</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
    </WorkspacePage>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <DataCard>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </DataCard>
  );
}
