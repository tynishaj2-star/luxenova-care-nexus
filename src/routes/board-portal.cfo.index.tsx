import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { DollarSign, Receipt, PieChart, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/board-portal/cfo/")({
  head: () => ({ meta: [{ title: "Treasurer Hub — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: CfoHub,
});

function CfoHub() {
  const [stats, setStats] = useState({ donationsYtd: 0, expensesYtd: 0, budgetYtd: 0 });
  useEffect(() => {
    (async () => {
      const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const [d, e, b] = await Promise.all([
        supabase.from("donations").select("amount_cents").gte("created_at", yearStart),
        supabase.from("expenses").select("amount").gte("paid_at", yearStart.slice(0, 10)),
        supabase.from("budgets").select("amount").eq("fiscal_year", new Date().getFullYear()),
      ]);
      setStats({
        donationsYtd: (d.data ?? []).reduce((s, x: { amount_cents: number }) => s + x.amount_cents / 100, 0),
        expensesYtd: (e.data ?? []).reduce((s, x: { amount: number }) => s + Number(x.amount), 0),
        budgetYtd: (b.data ?? []).reduce((s, x: { amount: number }) => s + Number(x.amount), 0),
      });
    })();
  }, []);

  const tiles = [
    { to: "/board-portal/cfo/donations", label: "Record Donation", desc: "Log donations by donor, source, and designation.", icon: DollarSign },
    { to: "/board-portal/cfo/expenses", label: "Expense Entry", desc: "Enter vendor bills, receipts, and reimbursements.", icon: Receipt },
    { to: "/board-portal/cfo/budget", label: "Budget View", desc: "Compare fiscal-year budget to actual spend.", icon: PieChart },
    { to: "/board-portal/cfo/reports", label: "Financial Reports", desc: "Export period reports for the board.", icon: FileBarChart },
  ] as const;

  return (
    <WorkspacePage
      title="Treasurer Hub"
      subtitle="Cash in, cash out, budget vs. actual, and board-ready financial exports."
      backTo="/board-portal"
      backLabel="Back to board portal"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Donations YTD" value={`$${stats.donationsYtd.toFixed(2)}`} />
        <Stat label="Expenses YTD" value={`$${stats.expensesYtd.toFixed(2)}`} />
        <Stat label={`Budget ${new Date().getFullYear()}`} value={`$${stats.budgetYtd.toFixed(2)}`} />
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
