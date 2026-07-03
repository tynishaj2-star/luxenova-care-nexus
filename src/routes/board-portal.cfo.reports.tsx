import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Download, Printer } from "lucide-react";

export const Route = createFileRoute("/board-portal/cfo/reports")({
  head: () => ({ meta: [{ title: "Financial Reports — Treasurer" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ReportsPage,
});

type Donation = { id: string; donor_name: string; amount_cents: number; source: string; designation: string | null; created_at: string };
type Expense = { id: string; category: string; vendor: string | null; amount: number; method: string | null; paid_at: string | null };

function ReportsPage() {
  const [start, setStart] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 10));
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  async function load() {
    const [d, e] = await Promise.all([
      supabase.from("donations").select("id,donor_name,amount_cents,source,designation,created_at").gte("created_at", start).lte("created_at", end + "T23:59:59").order("created_at", { ascending: false }),
      supabase.from("expenses").select("id,category,vendor,amount,method,paid_at").gte("paid_at", start).lte("paid_at", end).order("paid_at", { ascending: false }),
    ]);
    setDonations((d.data as Donation[]) ?? []);
    setExpenses((e.data as Expense[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [start, end]);

  const totals = useMemo(() => {
    const d = donations.reduce((s, r) => s + r.amount_cents / 100, 0);
    const e = expenses.reduce((s, r) => s + Number(r.amount), 0);
    return { donations: d, expenses: e, net: d - e };
  }, [donations, expenses]);

  const donationsBySource = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of donations) m.set(d.source, (m.get(d.source) ?? 0) + d.amount_cents / 100);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [donations]);

  const expensesByCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of expenses) m.set(e.category, (m.get(e.category) ?? 0) + Number(e.amount));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  function exportFullReport() {
    exportCsv(`financial-${start}-to-${end}`, [
      ...donations.map(d => ({ type: "donation", date: d.created_at.slice(0, 10), party: d.donor_name, category: d.designation ?? d.source, method: d.source, amount: (d.amount_cents / 100).toFixed(2) })),
      ...expenses.map(e => ({ type: "expense", date: e.paid_at ?? "", party: e.vendor ?? "", category: e.category, method: e.method ?? "", amount: (-Number(e.amount)).toFixed(2) })),
    ]);
  }

  return (
    <WorkspacePage
      title="Financial Reports"
      subtitle="Period view of donations, expenses, and net position — export for the board."
      backTo="/board-portal/cfo"
      backLabel="Back to Treasurer hub"
      actions={
        <>
          <ActionButton icon={Download} label="Export Full Report" variant="primary" onClick={exportFullReport} />
          <ActionButton icon={Download} label="Donations CSV" onClick={() => exportCsv(`donations-${start}-to-${end}`, donations.map(d => ({ ...d, amount: (d.amount_cents / 100).toFixed(2) })))} />
          <ActionButton icon={Download} label="Expenses CSV" onClick={() => exportCsv(`expenses-${start}-to-${end}`, expenses)} />
          <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
        </>
      }
    >
      <DataCard>
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Start</span><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inp} /></label>
          <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">End</span><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={inp} /></label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Stat label="Donations" value={`$${totals.donations.toFixed(2)}`} />
          <Stat label="Expenses" value={`$${totals.expenses.toFixed(2)}`} />
          <Stat label="Net" value={`$${totals.net.toFixed(2)}`} accent={totals.net >= 0 ? "text-emerald-700" : "text-destructive"} />
        </div>
      </DataCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataCard>
          <h2 className="font-display text-base">Donations by source</h2>
          {donationsBySource.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No donations in period.</p> : (
            <ul className="mt-3 divide-y divide-border/60">
              {donationsBySource.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between py-2 text-sm">
                  <span className="capitalize">{k}</span><strong>${v.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}
        </DataCard>
        <DataCard>
          <h2 className="font-display text-base">Expenses by category</h2>
          {expensesByCategory.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No expenses in period.</p> : (
            <ul className="mt-3 divide-y divide-border/60">
              {expensesByCategory.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between py-2 text-sm">
                  <span>{k}</span><strong>${v.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}
        </DataCard>
      </div>
    </WorkspacePage>
  );
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return <div className="rounded-2xl border border-border/70 bg-background p-4"><p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className={`mt-1 font-display text-xl ${accent ?? ""}`}>{value}</p></div>;
}
