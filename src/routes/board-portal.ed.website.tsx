import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Trash2, Save, Search } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/website")({
  head: () => ({ meta: [{ title: "Website Management — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: WebsitePage,
});

type A = { id: string; title: string; body: string | null; created_at: string; created_by: string | null };

function WebsitePage() {
  const [rows, setRows] = useState<A[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<A> | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  async function load() { const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }); setRows((data as A[]) ?? []); }
  useEffect(() => { supabase.auth.getSession().then(({data}) => setUid(data.session?.user.id ?? null)); load(); }, []);
  async function save() {
    if (!form || !form.title) return;
    if (form.id) await supabase.from("announcements").update({ title: form.title, body: form.body }).eq("id", form.id);
    else await supabase.from("announcements").insert({ title: form.title, body: form.body, created_by: uid });
    setForm(null); load();
  }
  async function remove(id: string) { if (!confirm("Delete announcement?")) return; await supabase.from("announcements").delete().eq("id", id); load(); }
  const filtered = rows.filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <WorkspacePage title="Website Management" subtitle="Post and manage announcements published to the board portal and site."
      actions={<>
        <ActionButton icon={Plus} label="New Announcement" variant="primary" onClick={() => setForm({})} />
        <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("announcements", filtered)} />
        <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
      </>}>
      <DataCard>
        <div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No announcements yet.</p> : (
          <ul className="divide-y divide-border/60">
            {filtered.map((r) => (
              <li key={r.id} className="flex items-start gap-4 py-3">
                <div className="flex-1">
                  <p className="font-medium">{r.title}</p>
                  {r.body && <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{r.body}</p>}
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
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
          <h2 className="font-display text-lg">{form.id ? "Edit Announcement" : "New Announcement"}</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Title *</span><input required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} /></label>
            <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Body</span><textarea rows={6} value={form.body ?? ""} onChange={(e) => setForm({ ...form, body: e.target.value })} className={inp} /></label>
          </div>
          <div className="mt-6 flex justify-end gap-2"><ActionButton label="Cancel" onClick={() => setForm(null)} /><ActionButton icon={Save} label="Publish" variant="primary" onClick={save} /></div>
        </div>
      </div>}
    </WorkspacePage>
  );
}
const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
