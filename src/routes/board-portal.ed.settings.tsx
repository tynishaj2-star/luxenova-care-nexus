import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { Save } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/settings")({
  head: () => ({ meta: [{ title: "Settings — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SettingsPage,
});

type Settings = { id: number; org_name: string; ein: string | null; address: string | null; phone: string | null; email: string | null; brand_color: string | null; logo_path: string | null };

function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("org_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setS((data as Settings) ?? { id: 1, org_name: "LuxeNova Community Wellness, Inc.", ein: null, address: null, phone: null, email: null, brand_color: null, logo_path: null }));
  }, []);

  async function save() {
    if (!s) return;
    await supabase.from("org_settings").upsert(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!s) return <WorkspacePage title="Settings"><p className="text-sm text-muted-foreground">Loading…</p></WorkspacePage>;

  return (
    <WorkspacePage title="Settings" subtitle="Organization profile, contact info, and branding."
      actions={<ActionButton icon={Save} label={saved ? "Saved ✓" : "Save"} variant="primary" onClick={save} />}>
      <DataCard>
        <div className="grid gap-4">
          <F label="Organization Name"><input value={s.org_name} onChange={(e) => setS({ ...s, org_name: e.target.value })} className={inp} /></F>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="EIN"><input value={s.ein ?? ""} onChange={(e) => setS({ ...s, ein: e.target.value })} className={inp} /></F>
            <F label="Brand Color"><input type="color" value={s.brand_color ?? "#8b3a3a"} onChange={(e) => setS({ ...s, brand_color: e.target.value })} className={`${inp} h-10`} /></F>
          </div>
          <F label="Address"><textarea rows={2} value={s.address ?? ""} onChange={(e) => setS({ ...s, address: e.target.value })} className={inp} /></F>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="Phone"><input value={s.phone ?? ""} onChange={(e) => setS({ ...s, phone: e.target.value })} className={inp} /></F>
            <F label="Email"><input type="email" value={s.email ?? ""} onChange={(e) => setS({ ...s, email: e.target.value })} className={inp} /></F>
          </div>
        </div>
      </DataCard>
    </WorkspacePage>
  );
}
const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>; }
