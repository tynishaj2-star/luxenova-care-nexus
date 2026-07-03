import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Notif = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  category: string;
  read_at: string | null;
  created_at: string;
};

export function NotificationsBell() {
  const [uid, setUid] = useState<string | null>(null);
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || cancelled) return;
      setUid(session.user.id);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (!cancelled) setItems((data as Notif[]) ?? []);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!uid) return;
    const channel = supabase
      .channel(`notifs:${uid}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
        (payload) => {
          setItems((prev) => [payload.new as Notif, ...prev].slice(0, 20));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
        (payload) => {
          setItems((prev) => prev.map((n) => (n.id === (payload.new as Notif).id ? (payload.new as Notif) : n)));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
        (payload) => {
          setItems((prev) => prev.filter((n) => n.id !== (payload.old as Notif).id));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [uid]);

  const unread = items.filter((n) => !n.read_at).length;

  async function markRead(id: string) {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
  }
  async function markAll() {
    if (!uid) return;
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", uid).is("read_at", null);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-soft transition hover:border-rosewood/40"
      >
        <Bell className="h-4 w-4" strokeWidth={1.5} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rosewood px-1 text-[10px] font-medium text-rosewood-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <button aria-hidden className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-luxe">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <p className="text-sm font-medium">Notifications</p>
              {unread > 0 && (
                <button onClick={markAll} className="text-xs text-rosewood hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {items.map((n) => (
                    <li key={n.id} className={`px-4 py-3 ${n.read_at ? "opacity-60" : ""}`}>
                      <div className="flex items-start gap-2">
                        <span
                          aria-hidden
                          className="mt-1.5 h-2 w-2 rounded-full bg-rosewood"
                          style={{ opacity: n.read_at ? 0 : 1 }}
                        />
                        <div className="min-w-0 flex-1">
                          {n.link ? (
                            <Link
                              to={n.link}
                              onClick={() => { markRead(n.id); setOpen(false); }}
                              className="block"
                            >
                              <p className="truncate text-sm font-medium hover:text-rosewood">{n.title}</p>
                            </Link>
                          ) : (
                            <p className="truncate text-sm font-medium">{n.title}</p>
                          )}
                          {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>}
                          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {n.category} · {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!n.read_at && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="text-[10px] text-rosewood hover:underline"
                          >
                            Mark
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-border/60 px-4 py-2 text-center">
              <Link
                to="/board-portal/notifications"
                onClick={() => setOpen(false)}
                className="text-xs text-rosewood hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
