import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoardPortalShell } from "@/components/portal/BoardPortalShell";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/board-portal/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: NotificationsPage,
});

type Notif = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  category: string;
  read_at: string | null;
  created_at: string;
};

function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setItems([]); setLoading(false); return; }
    const { data } = await supabase.from("notifications").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
    setItems((data as Notif[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    load();
  }
  async function markAll() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", session.user.id).is("read_at", null);
    load();
  }
  async function remove(id: string) {
    await supabase.from("notifications").delete().eq("id", id);
    load();
  }

  return (
    <BoardPortalShell title="Notifications" subtitle="Alerts, mentions, and updates just for you.">
      <div className="mb-4 flex justify-end">
        <button onClick={markAll} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft">
          <CheckCheck className="h-4 w-4" strokeWidth={1.5} /> Mark all read
        </button>
      </div>
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <div className="grid place-items-center py-10 text-center">
            <Bell className="h-10 w-10 text-muted-foreground" strokeWidth={1} />
            <p className="mt-2 text-sm text-muted-foreground">No notifications.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((n) => (
              <li key={n.id} className={`flex items-start gap-3 py-4 ${n.read_at ? "opacity-70" : ""}`}>
                <span className="mt-1.5 h-2 w-2 rounded-full bg-rosewood" style={{ opacity: n.read_at ? 0 : 1 }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {n.category} · {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.read_at && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-rosewood hover:underline">
                    Mark read
                  </button>
                )}
                <button onClick={() => remove(n.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BoardPortalShell>
  );
}
