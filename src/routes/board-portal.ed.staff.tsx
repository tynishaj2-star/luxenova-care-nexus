import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Trash2, Save, Search } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/staff")({
  head: () => ({ meta: [{ title: "Staff Management — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: StaffPage,
});

type S = { id: string; full_name: string; title: string | null; email: string | null; phone: string | null; employment_status: string | null; start_date: string | null; notes: string | null };

function StaffPage() {
  const [rows, setRows] = useState<S[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<S> | null>(null);
  async function load() { const { data } = await supabase.from("staff").select("*").order("created_at", { ascending: false }); setRows((data as S[]) ?? []); }
  useEffect(() => { load(); }, []);
  async function save() {
    if (!form || !form.full_name) return;
    if (form.id) await supabase.from("staff").update(form as any).eq("id", form.id);
    else await supabase.from("staff").insert(form as any);
    setForm(null); load();
  }
  async function remove(id: string) { if (!confirm("Delete?")) return; await supabase.from("staff").delete().eq("id", id); load(); }
  const filtered = rows.filter((r) => !q || `${r.full_name} ${r.title ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <WorkspacePage title="Staff Management" subtitle="Team roster, roles, and onboarding status."
      actions={<>
        <ActionButton icon={Plus} label="Add Staff" variant="primary" onClick={() => setForm({ employment_status: "active" })} />
        <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("staff", filtered)} />
        <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
      </>}>
      <DataCard>
        <div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No staff yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="py-2">Name</th><th>Title</th><th>Email</th><th>Phone</th><th>Status</th><th>Start</th><th></th></tr></thead>
            <tbody>{filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/60">
                <td className="py-2 pr-3">{r.full_name}</td><td className="pr-3">{r.title ?? "—"}</td><td className="pr-3">{r.email ?? "—"}</td>
                <td className="pr-3">{r.phone ?? "—"}</td><td className="pr-3 capitalize">{r.employment_status ?? "—"}</td><td className="pr-3">{r.start_date ?? "—"}</td>
                <td><div className="flex gap-1"><button onClick={() => setForm(r)} className="text-xs text-rosewood hover:underline">Edit</button><button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </DataCard>
      {form && <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setForm(null)}>
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe">
          <h2 className="font-display text-lg">{form.id ? "Edit Staff" : "Add Staff"}</h2>
          <div className="mt-4 grid gap-3">
            <F label="Full name *"><input required value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inp} /></F>
            <F label="Title"><input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Email"><input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} /></F>
              <F label="Phone"><input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Status"><select value={form.employment_status ?? "active"} onChange={(e) => setForm({ ...form, employment_status: e.target.value })} className={inp}>{["active","onboarding","leave","terminated"].map((s) => <option key={s}>{s}</option>)}</select></F>
              <F label="Start date"><input type="date" value={form.start_date ?? ""} onChange={(e) => setForm({ ...form, start_date: e.target.value || null })} className={inp} /></F>
            </div>
            <F label="Notes"><textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inp} /></F>
          </div>
          <div className="mt-6 flex justify-end gap-2"><ActionButton label="Cancel" onClick={() => setForm(null)} /><ActionButton icon={Save} label="Save" variant="primary" onClick={save} /></div>
        </div>
      </div>}
    </WorkspacePage>
  );
}
const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>; }
