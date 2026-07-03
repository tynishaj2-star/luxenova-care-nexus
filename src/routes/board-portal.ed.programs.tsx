import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Trash2, Save, Search } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/programs")({
  head: () => ({ meta: [{ title: "Programs — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ProgPage,
});

type P = { id: string; name: string; description: string | null; status: string; start_at: string | null; end_at: string | null; budget: number | null; participant_count: number | null; outcomes: string | null };

function ProgPage() {
  const [rows, setRows] = useState<P[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<P> | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  async function load() { const { data } = await supabase.from("programs").select("*").order("created_at", { ascending: false }); setRows((data as P[]) ?? []); }
  useEffect(() => { supabase.auth.getSession().then(({data}) => setUid(data.session?.user.id ?? null)); load(); }, []);
  async function save() {
    if (!form || !form.name) return;
    const p = { ...form, created_by: uid };
    if (form.id) await supabase.from("programs").update(p as any).eq("id", form.id);
    else await supabase.from("programs").insert(p as any);
    setForm(null); load();
  }
  async function remove(id: string) { if (!confirm("Delete?")) return; await supabase.from("programs").delete().eq("id", id); load(); }
  const filtered = rows.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <WorkspacePage title="Program Management" subtitle="Programs, outcomes, and participant counts."
      actions={<>
        <ActionButton icon={Plus} label="New Program" variant="primary" onClick={() => setForm({ status: "active" })} />
        <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("programs", filtered)} />
        <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
      </>}>
      <DataCard>
        <div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No programs yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="py-2">Name</th><th>Status</th><th>Start</th><th>End</th><th>Budget</th><th>Participants</th><th></th></tr></thead>
            <tbody>{filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/60">
                <td className="py-2 pr-3">{r.name}</td><td className="pr-3 capitalize">{r.status}</td><td className="pr-3">{r.start_at ?? "—"}</td>
                <td className="pr-3">{r.end_at ?? "—"}</td><td className="pr-3">{r.budget ? `$${r.budget}` : "—"}</td><td className="pr-3">{r.participant_count ?? 0}</td>
                <td><div className="flex gap-1"><button onClick={() => setForm(r)} className="text-xs text-rosewood hover:underline">Edit</button><button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </DataCard>
      {form && <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setForm(null)}>
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe">
          <h2 className="font-display text-lg">{form.id ? "Edit Program" : "New Program"}</h2>
          <div className="mt-4 grid gap-3">
            <F label="Name *"><input required value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></F>
            <F label="Description"><textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} /></F>
            <div className="grid grid-cols-3 gap-3">
              <F label="Status"><select value={form.status ?? "active"} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}>{["draft","active","paused","completed","archived"].map((s) => <option key={s}>{s}</option>)}</select></F>
              <F label="Start"><input type="date" value={form.start_at ?? ""} onChange={(e) => setForm({ ...form, start_at: e.target.value || null })} className={inp} /></F>
              <F label="End"><input type="date" value={form.end_at ?? ""} onChange={(e) => setForm({ ...form, end_at: e.target.value || null })} className={inp} /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Budget"><input type="number" step="0.01" value={form.budget ?? ""} onChange={(e) => setForm({ ...form, budget: e.target.value ? Number(e.target.value) : null })} className={inp} /></F>
              <F label="Participants"><input type="number" value={form.participant_count ?? 0} onChange={(e) => setForm({ ...form, participant_count: Number(e.target.value) })} className={inp} /></F>
            </div>
            <F label="Outcomes"><textarea rows={2} value={form.outcomes ?? ""} onChange={(e) => setForm({ ...form, outcomes: e.target.value })} className={inp} /></F>
          </div>
          <div className="mt-6 flex justify-end gap-2"><ActionButton label="Cancel" onClick={() => setForm(null)} /><ActionButton icon={Save} label="Save" variant="primary" onClick={save} /></div>
        </div>
      </div>}
    </WorkspacePage>
  );
}
const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>; }
