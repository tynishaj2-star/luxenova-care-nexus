import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Search, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/grants")({
  head: () => ({ meta: [{ title: "Grant Management — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: GrantsPage,
});

type Grant = {
  id: string; funder: string; program: string | null;
  amount_requested: number | null; amount_awarded: number | null;
  status: string; deadline: string | null; report_due_at: string | null; notes: string | null;
};

const empty: Partial<Grant> = { funder: "", program: "", status: "prospect" };

function GrantsPage() {
  const [rows, setRows] = useState<Grant[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<Grant> | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("grants").select("*").order("created_at", { ascending: false });
    setRows((data as Grant[]) ?? []);
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUid(data.session?.user.id ?? null));
    load();
  }, []);

  async function save() {
    if (!form || !form.funder) return;
    const payload = { ...form, created_by: uid };
    if (form.id) await supabase.from("grants").update(payload as any).eq("id", form.id);
    else await supabase.from("grants").insert(payload as any);
    setForm(null); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this grant?")) return;
    await supabase.from("grants").delete().eq("id", id); load();
  }

  const filtered = rows.filter((r) =>
    !q || `${r.funder} ${r.program ?? ""} ${r.status}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <WorkspacePage
      title="Grant Management"
      subtitle="Track funder pipeline, awards, deadlines, and reports due."
      actions={
        <>
          <ActionButton icon={Plus} label="New Grant" variant="primary" onClick={() => setForm({ ...empty })} />
          <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("grants", filtered)} />
          <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
        </>
      }
    >
      <DataCard>
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search funder, program, status…"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No grants yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr><th className="py-2">Funder</th><th>Program</th><th>Requested</th><th>Awarded</th><th>Status</th><th>Deadline</th><th>Report Due</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="py-2 pr-3">{r.funder}</td>
                    <td className="pr-3">{r.program ?? "—"}</td>
                    <td className="pr-3">{r.amount_requested ? `$${r.amount_requested}` : "—"}</td>
                    <td className="pr-3">{r.amount_awarded ? `$${r.amount_awarded}` : "—"}</td>
                    <td className="pr-3 capitalize">{r.status}</td>
                    <td className="pr-3">{r.deadline ?? "—"}</td>
                    <td className="pr-3">{r.report_due_at ?? "—"}</td>
                    <td className="pr-3">
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
            <h2 className="font-display text-lg">{form.id ? "Edit Grant" : "New Grant"}</h2>
            <div className="mt-4 grid gap-3">
              <Field label="Funder *"><input required value={form.funder ?? ""} onChange={(e) => setForm({ ...form, funder: e.target.value })} className={inp} /></Field>
              <Field label="Program"><input value={form.program ?? ""} onChange={(e) => setForm({ ...form, program: e.target.value })} className={inp} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Requested"><input type="number" step="0.01" value={form.amount_requested ?? ""} onChange={(e) => setForm({ ...form, amount_requested: e.target.value ? Number(e.target.value) : null })} className={inp} /></Field>
                <Field label="Awarded"><input type="number" step="0.01" value={form.amount_awarded ?? ""} onChange={(e) => setForm({ ...form, amount_awarded: e.target.value ? Number(e.target.value) : null })} className={inp} /></Field>
              </div>
              <Field label="Status"><select value={form.status ?? "prospect"} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}>
                {["prospect","applied","awarded","denied","reporting","closed"].map((s) => <option key={s}>{s}</option>)}
              </select></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Deadline"><input type="date" value={form.deadline ?? ""} onChange={(e) => setForm({ ...form, deadline: e.target.value || null })} className={inp} /></Field>
                <Field label="Report Due"><input type="date" value={form.report_due_at ?? ""} onChange={(e) => setForm({ ...form, report_due_at: e.target.value || null })} className={inp} /></Field>
              </div>
              <Field label="Notes"><textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inp} /></Field>
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
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>;
}
