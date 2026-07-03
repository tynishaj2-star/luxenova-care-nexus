import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Search, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/donations")({
  head: () => ({ meta: [{ title: "Donations — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: DonationsPage,
});

type Donation = {
  id: string; donor_name: string; donor_email: string | null;
  amount_cents: number; currency: string; source: string;
  designation: string | null; notes: string | null; created_at: string;
};

function DonationsPage() {
  const [rows, setRows] = useState<Donation[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<Donation> | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    setRows((data as Donation[]) ?? []);
  }
  useEffect(() => { supabase.auth.getSession().then(({data}) => setUid(data.session?.user.id ?? null)); load(); }, []);

  async function save() {
    if (!form || !form.donor_name || !form.amount_cents) return;
    const payload: any = {
      donor_name: form.donor_name,
      donor_email: form.donor_email ?? null,
      amount_cents: form.amount_cents,
      currency: form.currency ?? "USD",
      source: form.source ?? "manual",
      designation: form.designation ?? null,
      notes: form.notes ?? null,
      recorded_by: uid,
    };
    if (form.id) await supabase.from("donations").update(payload as any).eq("id", form.id);
    else await supabase.from("donations").insert(payload as any);
    setForm(null); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete donation?")) return;
    await supabase.from("donations").delete().eq("id", id); load();
  }

  const filtered = rows.filter((r) => !q || `${r.donor_name} ${r.donor_email ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const total = filtered.reduce((s, r) => s + r.amount_cents, 0) / 100;

  return (
    <WorkspacePage
      title="Donations"
      subtitle="Record donations, track designations, and export for reporting."
      actions={
        <>
          <ActionButton icon={Plus} label="Record Donation" variant="primary" onClick={() => setForm({ currency: "USD", source: "manual" })} />
          <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("donations", filtered.map(d => ({...d, amount: (d.amount_cents/100).toFixed(2)})))} />
          <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
        </>
      }
    >
      <DataCard>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search donor…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div className="text-sm"><span className="text-muted-foreground">Filtered total:</span> <strong>${total.toFixed(2)}</strong></div>
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No donations recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr><th className="py-2">Donor</th><th>Email</th><th>Amount</th><th>Source</th><th>Designation</th><th>Received</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="py-2 pr-3">{r.donor_name}</td>
                    <td className="pr-3">{r.donor_email ?? "—"}</td>
                    <td className="pr-3">${(r.amount_cents/100).toFixed(2)}</td>
                    <td className="pr-3">{r.source}</td>
                    <td className="pr-3">{r.designation ?? "—"}</td>
                    <td className="pr-3">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => setForm(r)} className="text-xs text-rosewood hover:underline">Edit</button>
                        <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
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
            <h2 className="font-display text-lg">{form.id ? "Edit Donation" : "Record Donation"}</h2>
            <div className="mt-4 grid gap-3">
              <F label="Donor name *"><input required value={form.donor_name ?? ""} onChange={(e) => setForm({ ...form, donor_name: e.target.value })} className={inp} /></F>
              <F label="Donor email"><input type="email" value={form.donor_email ?? ""} onChange={(e) => setForm({ ...form, donor_email: e.target.value })} className={inp} /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Amount (USD) *"><input required type="number" step="0.01" value={form.amount_cents ? form.amount_cents/100 : ""} onChange={(e) => setForm({ ...form, amount_cents: Math.round(Number(e.target.value)*100) })} className={inp} /></F>
                <F label="Source"><select value={form.source ?? "manual"} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inp}>
                  {["manual","cash","check","card","ach","in-kind","other"].map((m) => <option key={m}>{m}</option>)}
                </select></F>
              </div>
              <F label="Designation"><input value={form.designation ?? ""} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inp} placeholder="e.g. Sponsor-a-family, General fund" /></F>
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
