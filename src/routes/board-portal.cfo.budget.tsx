import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/board-portal/cfo/budget")({
  head: () => ({ meta: [{ title: "Budget View — Treasurer" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: BudgetPage,
});

type Budget = { id: string; fiscal_year: number; category: string; amount: number; notes: string | null };
type Expense = { category: string; amount: number; paid_at: string | null };

const CATEGORIES = ["Programs", "Fundraising", "Administration", "Payroll", "Rent", "Utilities", "Insurance", "Supplies", "Travel", "Professional services", "Other"];

function BudgetPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<Partial<Budget> | null>(null);

  async function load() {
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;
    const [b, e] = await Promise.all([
      supabase.from("budgets").select("*").eq("fiscal_year", year).order("category"),
      supabase.from("expenses").select("category,amount,paid_at").gte("paid_at", start).lte("paid_at", end),
    ]);
    setBudgets((b.data as Budget[]) ?? []);
    setExpenses((e.data as Expense[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [year]);

  const actualsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + Number(e.amount));
    return map;
  }, [expenses]);

  const rows = useMemo(() => {
    const cats = new Set<string>([...budgets.map(b => b.category), ...expenses.map(e => e.category)]);
    return Array.from(cats).sort().map((cat) => {
      const b = budgets.find(x => x.category === cat);
      const actual = actualsByCategory.get(cat) ?? 0;
      const planned = Number(b?.amount ?? 0);
      const variance = planned - actual;
      const pct = planned > 0 ? Math.min(100, Math.round((actual / planned) * 100)) : 0;
      return { id: b?.id, category: cat, planned, actual, variance, pct, budget: b };
    });
  }, [budgets, expenses, actualsByCategory]);

  const totals = useMemo(() => ({
    planned: rows.reduce((s, r) => s + r.planned, 0),
    actual: rows.reduce((s, r) => s + r.actual, 0),
  }), [rows]);

  async function save() {
    if (!form || !form.category || form.amount == null) return;
    const payload = {
      fiscal_year: form.fiscal_year ?? year,
      category: form.category,
      amount: form.amount,
      notes: form.notes ?? null,
    };
    if (form.id) await supabase.from("budgets").update(payload).eq("id", form.id);
    else await supabase.from("budgets").insert(payload);
    setForm(null); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete budget line?")) return;
    await supabase.from("budgets").delete().eq("id", id); load();
  }

  return (
    <WorkspacePage
      title="Budget View"
      subtitle="Compare fiscal-year budget to actual spend by category."
      backTo="/board-portal/cfo"
      backLabel="Back to Treasurer hub"
      actions={
        <>
          <ActionButton icon={Plus} label="Add Budget Line" variant="primary" onClick={() => setForm({ fiscal_year: year })} />
          <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv(`budget-${year}`, rows.map(r => ({ category: r.category, planned: r.planned.toFixed(2), actual: r.actual.toFixed(2), variance: r.variance.toFixed(2) })))} />
          <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
        </>
      }
    >
      <DataCard>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <label className="grid gap-1">
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Fiscal Year</span>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={inp}>
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <Stat label="Planned" value={`$${totals.planned.toFixed(2)}`} />
            <Stat label="Actual" value={`$${totals.actual.toFixed(2)}`} />
            <Stat label="Remaining" value={`$${(totals.planned - totals.actual).toFixed(2)}`} accent={totals.planned - totals.actual >= 0 ? "text-emerald-700" : "text-destructive"} />
          </div>
        </div>
      </DataCard>

      <DataCard>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No budget lines or expenses for {year} yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr><th className="py-2">Category</th><th>Planned</th><th>Actual</th><th>Variance</th><th className="w-1/3">Progress</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.category} className="border-t border-border/60">
                    <td className="py-2 pr-3">{r.category}</td>
                    <td className="pr-3">${r.planned.toFixed(2)}</td>
                    <td className="pr-3">${r.actual.toFixed(2)}</td>
                    <td className={`pr-3 ${r.variance < 0 ? "text-destructive" : "text-emerald-700"}`}>${r.variance.toFixed(2)}</td>
                    <td className="pr-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-accent/40">
                        <div className={`h-full ${r.pct >= 100 ? "bg-destructive" : "bg-rosewood"}`} style={{ width: `${r.pct}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{r.pct}% of budget</p>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {r.budget && <button onClick={() => setForm(r.budget!)} className="text-xs text-rosewood hover:underline">Edit</button>}
                        {!r.budget && <button onClick={() => setForm({ fiscal_year: year, category: r.category })} className="text-xs text-rosewood hover:underline">Set</button>}
                        {r.id && <button onClick={() => remove(r.id!)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>

      {form && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setForm(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe">
            <h2 className="font-display text-lg">{form.id ? "Edit Budget Line" : "Add Budget Line"}</h2>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <F label="Fiscal Year *"><input required type="number" value={form.fiscal_year ?? year} onChange={(e) => setForm({ ...form, fiscal_year: Number(e.target.value) })} className={inp} /></F>
                <F label="Amount (USD) *"><input required type="number" step="0.01" value={form.amount ?? ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className={inp} /></F>
              </div>
              <F label="Category *">
                <select required value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </F>
              <F label="Notes"><textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inp} /></F>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <ActionButton label="Cancel" onClick={() => setForm(null)} />
              <ActionButton icon={Save} label="Save" variant="primary" onClick={save} />
            </div>
          </div>
        </div>
      )}
    </WorkspacePage>
  );
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>;
}
function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return <div className="rounded-2xl border border-border/70 bg-background p-3"><p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className={`mt-1 font-display text-lg ${accent ?? ""}`}>{value}</p></div>;
}
