import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv } from "@/lib/export-csv";
import { Download, Search } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/audit")({
  head: () => ({ meta: [{ title: "Audit Logs — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AuditPage,
});

type Row = { id: string; actor_id: string | null; entity_type: string; entity_id: string | null; action: string; summary: string; created_at: string };

function AuditPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    supabase.from("activity_feed").select("*").order("created_at", { ascending: false }).limit(500)
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  const filtered = rows.filter((r) =>
    (!type || r.entity_type === type) &&
    (!q || `${r.summary} ${r.action} ${r.entity_type}`.toLowerCase().includes(q.toLowerCase()))
  );
  const types = Array.from(new Set(rows.map((r) => r.entity_type)));

  return (
    <WorkspacePage title="Audit Logs" subtitle="Read-only trail of all record changes across the organization."
      actions={<ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("audit-log", filtered)} />}>
      <DataCard>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">All types</option>
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No activity.</p> : (
          <ul className="divide-y divide-border/60">
            {filtered.map((r) => (
              <li key={r.id} className="grid grid-cols-[110px_1fr_auto] gap-3 py-2 text-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] text-rosewood">{r.entity_type}</span>
                <span>{r.summary}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </DataCard>
    </WorkspacePage>
  );
}
