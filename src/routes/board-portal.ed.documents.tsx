import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/documents")({
  head: () => ({ meta: [{ title: "Organization Documents — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: OrgDocs,
});

type Doc = { id: string; file_name: string; category: string | null; visibility: string; created_at: string; owner_id: string };

function OrgDocs() {
  const [rows, setRows] = useState<Doc[]>([]);
  async function load() {
    const { data } = await supabase.from("documents").select("id,file_name,category,visibility,created_at,owner_id").order("created_at", { ascending: false });
    setRows((data as Doc[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  const grouped = rows.reduce<Record<string, Doc[]>>((acc, r) => {
    const k = r.category ?? "Uncategorized";
    (acc[k] ??= []).push(r);
    return acc;
  }, {});

  return (
    <WorkspacePage title="Organization Documents" subtitle="Bylaws, articles of incorporation, EIN, filings — organized by owner and category."
      actions={<Link to="/board-portal/documents" className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe"><Upload className="h-4 w-4" strokeWidth={1.5} /> Upload / Manage</Link>}>
      {Object.keys(grouped).length === 0 ? (
        <DataCard><p className="text-sm text-muted-foreground">No documents yet. Use "Upload / Manage" to add files.</p></DataCard>
      ) : (
        Object.entries(grouped).map(([cat, list]) => (
          <DataCard key={cat}>
            <h2 className="font-display text-base">{cat} <span className="text-xs text-muted-foreground">({list.length})</span></h2>
            <ul className="mt-3 divide-y divide-border/60">
              {list.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-2 text-sm">
                  <FileText className="h-4 w-4 text-rosewood" strokeWidth={1.5} />
                  <span className="flex-1">{d.file_name}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{d.visibility}</span>
                  <span className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </DataCard>
        ))
      )}
    </WorkspacePage>
  );
}
