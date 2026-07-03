import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Trash2, Save, Search } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/volunteers")({
  head: () => ({ meta: [{ title: "Volunteers — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: VolPage,
});

type V = { id: string; full_name: string; email: string | null; phone: string | null; skills: string | null; background_check_status: string | null; background_checked_at: string | null; hours_ytd: number; active: boolean; notes: string | null };

function VolPage() {
  const [rows, setRows] = useState<V[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<V> | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  async function load() { const { data } = await supabase.from("volunteers").select("*").order("created_at", { ascending: false }); setRows((data as V[]) ?? []); }
  useEffect(() => { supabase.auth.getSession().then(({data}) => setUid(data.session?.user.id ?? null)); load(); }, []);

  async function save() {
    if (!form || !form.full_name) return;
    const p = { ...form, created_by: uid };
    if (form.id) await supabase.from("volunteers").update(p as any).eq("id", form.id);
    else await supabase.from("volunteers").insert(p as any);
    setForm(null); load();
  }
  async function remove(id: string) { if (!confirm("Delete volunteer?")) return; await supabase.from("volunteers").delete().eq("id", id); load(); }

  const filtered = rows.filter((r) => !q || `${r.full_name} ${r.email ?? ""} ${r.skills ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <WorkspacePage
      title="Volunteer Management"
      subtitle="Volunteer records, hours, and background-check tracking."
      actions={<>
        <ActionButton icon={Plus} label="New Volunteer" variant="primary" onClick={() => setForm({ active: true, background_check_status: "pending" })} />
        <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("volunteers", filtered)} />
        <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
      </>}
    >
      <DataCard>
        <div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No volunteers yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="py-2">Name</th><th>Email</th><th>Phone</th><th>Skills</th><th>BG Check</th><th>Hours YTD</th><th>Active</th><th></th></tr></thead>
            <tbody>{filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/60">
                <td className="py-2 pr-3">{r.full_name}</td><td className="pr-3">{r.email ?? "—"}</td><td className="pr-3">{r.phone ?? "—"}</td>
                <td className="pr-3">{r.skills ?? "—"}</td><td className="pr-3 capitalize">{r.background_check_status ?? "—"}</td>
                <td className="pr-3">{r.hours_ytd}</td><td className="pr-3">{r.active ? "✓" : "—"}</td>
                <td><div className="flex gap-1"><button onClick={() => setForm(r)} className="text-xs text-rosewood hover:underline">Edit</button><button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </DataCard>

      {form && <Modal onClose={() => setForm(null)} title={form.id ? "Edit Volunteer" : "New Volunteer"}>
        <F label="Full name *"><input required value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inp} /></F>
        <div className="grid grid-cols-2 gap-3">
          <F label="Email"><input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} /></F>
          <F label="Phone"><input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} /></F>
        </div>
        <F label="Skills"><input value={form.skills ?? ""} onChange={(e) => setForm({ ...form, skills: e.target.value })} className={inp} /></F>
        <div className="grid grid-cols-2 gap-3">
          <F label="BG check status"><select value={form.background_check_status ?? "pending"} onChange={(e) => setForm({ ...form, background_check_status: e.target.value })} className={inp}>{["pending","in_progress","cleared","failed","expired"].map((s) => <option key={s}>{s}</option>)}</select></F>
          <F label="BG checked at"><input type="date" value={form.background_checked_at ?? ""} onChange={(e) => setForm({ ...form, background_checked_at: e.target.value || null })} className={inp} /></F>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <F label="Hours YTD"><input type="number" step="0.01" value={form.hours_ytd ?? 0} onChange={(e) => setForm({ ...form, hours_ytd: Number(e.target.value) })} className={inp} /></F>
          <label className="flex items-center gap-2 pt-6 text-sm"><input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        </div>
        <F label="Notes"><textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inp} /></F>
        <div className="mt-4 flex justify-end gap-2"><ActionButton label="Cancel" onClick={() => setForm(null)} /><ActionButton icon={Save} label="Save" variant="primary" onClick={save} /></div>
      </Modal>}
    </WorkspacePage>
  );
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>; }
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={onClose}><div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe"><h2 className="mb-4 font-display text-lg">{title}</h2><div className="grid gap-3">{children}</div></div></div>;
}
