import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv } from "@/lib/export-csv";
import { Plus, Download, Trash2, Save, Search } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/board")({
  head: () => ({ meta: [{ title: "Board Management — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: BoardMgmt,
});

type M = { id: string; member_key: string; full_name: string; user_id: string; created_at: string };

function BoardMgmt() {
  const [rows, setRows] = useState<M[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<M> | null>(null);
  async function load() { const { data } = await supabase.from("board_members").select("*").order("full_name"); setRows((data as M[]) ?? []); }
  useEffect(() => { load(); }, []);
  async function save() {
    if (!form || !form.full_name || !form.member_key || !form.user_id) return;
    const p: any = { member_key: form.member_key, full_name: form.full_name, user_id: form.user_id };
    if (form.id) await supabase.from("board_members").update(p as any).eq("id", form.id);
    else await supabase.from("board_members").insert(p as any);
    setForm(null); load();
  }
  async function remove(id: string) { if (!confirm("Remove board member?")) return; await supabase.from("board_members").delete().eq("id", id); load(); }
  const filtered = rows.filter((r) => !q || r.full_name.toLowerCase().includes(q.toLowerCase()));

  return (
    <WorkspacePage title="Board Management" subtitle="Founding board roster and portal access."
      actions={<>
        <ActionButton icon={Plus} label="Add Member" variant="primary" onClick={() => setForm({})} />
        <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("board-members", filtered)} />
      </>}>
      <DataCard>
        <div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No board members yet.</p> : (
          <ul className="divide-y divide-border/60">
            {filtered.map((r) => (
              <li key={r.id} className="flex items-center gap-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/50 font-display text-rosewood">{r.full_name.split(" ").map((s) => s[0]).slice(0,2).join("")}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.full_name} <span className="text-xs text-muted-foreground">({r.member_key})</span></p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">user id: {r.user_id}</p>
                </div>
                <button onClick={() => setForm(r)} className="text-xs text-rosewood hover:underline">Edit</button>
                <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button>
              </li>
            ))}
          </ul>
        )}
      </DataCard>
      {form && <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setForm(null)}>
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe">
          <h2 className="font-display text-lg">{form.id ? "Edit Member" : "Add Member"}</h2>
          <div className="mt-4 grid gap-3">
            <F label="Member key * (lowercase id, e.g. tynisha)"><input required value={form.member_key ?? ""} onChange={(e) => setForm({ ...form, member_key: e.target.value })} className={inp} /></F>
            <F label="Full name *"><input required value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inp} /></F>
            <F label="Linked user ID * (uuid of auth user)"><input required value={form.user_id ?? ""} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className={inp} placeholder="uuid" /></F>
          </div>
          <div className="mt-6 flex justify-end gap-2"><ActionButton label="Cancel" onClick={() => setForm(null)} /><ActionButton icon={Save} label="Save" variant="primary" onClick={save} /></div>
        </div>
      </div>}
    </WorkspacePage>
  );
}
const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>; }
