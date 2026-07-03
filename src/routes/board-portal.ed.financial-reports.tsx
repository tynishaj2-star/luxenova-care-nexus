import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/financial-reports")({
  head: () => ({ meta: [{ title: "Financial Reports — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: FinancialReports,
});

type Expense = { id: string; category: string; vendor: string | null; amount: number; paid_at: string | null; method: string | null; notes: string | null };
type Donation = { id: string; amount_cents: number; created_at: string; donor_name: string };

function FinancialReports() {
  const [start, setStart] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0,10));
  const [end, setEnd] = useState(new Date().toISOString().slice(0,10));
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [form, setForm] = useState<Partial<Expense> | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  async function load() {
    const [ex, dn] = await Promise.all([
      supabase.from("expenses").select("*").gte("paid_at", start).lte("paid_at", end).order("paid_at", { ascending: false }),
      supabase.from("donations").select("id,amount_cents,created_at,donor_name").gte("created_at", start).lte("created_at", end + "T23:59:59").order("created_at", { ascending: false }),
    ]);
    setExpenses((ex.data as Expense[]) ?? []);
    setDonations((dn.data as Donation[]) ?? []);
  }
  useEffect(() => { supabase.auth.getSession().then(({data}) => setUid(data.session?.user.id ?? null)); load(); }, [start, end]);

  const totals = useMemo(() => {
    const d = donations.reduce((s, r) => s + r.amount_cents / 100, 0);
    const e = expenses.reduce((s, r) => s + Number(r.amount), 0);
    return { donations: d, expenses: e, net: d - e };
  }, [donations, expenses]);


  async function saveExpense() {
    if (!form || !form.category || !form.amount) return;
    const p = { ...form, created_by: uid };
    if (form.id) await supabase.from("expenses").update(p as any).eq("id", form.id);
    else await supabase.from("expenses").insert(p as any);
    setForm(null); load();
  }
  async function removeExpense(id: string) { if (!confirm("Delete expense?")) return; await supabase.from("expenses").delete().eq("id", id); load(); }

  return (
    <WorkspacePage title="Financial Reports" subtitle="Period view of donations, expenses, and net position."
      actions={<>
        <ActionButton icon={Plus} label="Add Expense" variant="primary" onClick={() => setForm({ paid_at: new Date().toISOString().slice(0,10) })} />
        <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv(`financial-${start}-to-${end}`, [
          ...donations.map(d => ({ type: "donation", date: d.created_at, party: d.donor_name, amount: (d.amount_cents/100).toFixed(2) })),
          ...expenses.map(e => ({ type: "expense", date: e.paid_at, party: e.vendor, amount: -Number(e.amount), category: e.category })),
        ])} />
        <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
      </>}>
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

      <DataCard>
        <h2 className="font-display text-base">Expenses in period</h2>
        {expenses.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No expenses recorded in period.</p> : (
          <div className="mt-3 overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="py-2">Date</th><th>Category</th><th>Vendor</th><th>Method</th><th>Amount</th><th></th></tr></thead>
            <tbody>{expenses.map((r) => (
              <tr key={r.id} className="border-t border-border/60">
                <td className="py-2 pr-3">{r.paid_at ?? "—"}</td><td className="pr-3">{r.category}</td><td className="pr-3">{r.vendor ?? "—"}</td>
                <td className="pr-3">{r.method ?? "—"}</td><td className="pr-3">${Number(r.amount).toFixed(2)}</td>
                <td><div className="flex gap-1"><button onClick={() => setForm(r)} className="text-xs text-rosewood hover:underline">Edit</button><button onClick={() => removeExpense(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </DataCard>

      <DataCard>
        <h2 className="font-display text-base">Donations in period</h2>
        {donations.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No donations recorded in period.</p> : (
          <ul className="mt-3 divide-y divide-border/60">
            {donations.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-2 text-sm">
                <span>{d.donor_name} · <span className="text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</span></span>
                <strong>${(d.amount_cents/100).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        )}
      </DataCard>

      {form && <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setForm(null)}>
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe">
          <h2 className="font-display text-lg">{form.id ? "Edit Expense" : "Add Expense"}</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Category *</span><input required value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp} /></label>
            <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Vendor</span><input value={form.vendor ?? ""} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className={inp} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Amount *</span><input required type="number" step="0.01" value={form.amount ?? ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className={inp} /></label>
              <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Paid at</span><input type="date" value={form.paid_at ?? ""} onChange={(e) => setForm({ ...form, paid_at: e.target.value || null })} className={inp} /></label>
            </div>
            <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Method</span><select value={form.method ?? ""} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inp}><option value="">—</option>{["card","ach","check","cash","other"].map((m) => <option key={m}>{m}</option>)}</select></label>
            <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Notes</span><textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inp} /></label>
          </div>
          <div className="mt-6 flex justify-end gap-2"><ActionButton label="Cancel" onClick={() => setForm(null)} /><ActionButton icon={Save} label="Save" variant="primary" onClick={saveExpense} /></div>
        </div>
      </div>}
    </WorkspacePage>
  );
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return <div className="rounded-2xl border border-border/70 bg-background p-4"><p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className={`mt-1 font-display text-xl ${accent ?? ""}`}>{value}</p></div>;
}
