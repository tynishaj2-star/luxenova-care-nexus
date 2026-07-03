import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoardPortalShell } from "@/components/portal/BoardPortalShell";
import { CalendarCheck, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/board-portal/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: CalendarPage,
});

type Ev = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  event_type: string;
  created_by: string | null;
};

function CalendarPage() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("meeting");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("calendar_events").select("*").order("starts_at", { ascending: true });
    setEvents((data as Ev[]) ?? []);
    setLoading(false);
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUid(session?.user.id ?? null));
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startsAt || !uid) return;
    const { error } = await supabase.from("calendar_events").insert({
      title: title.trim(),
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      location: location.trim() || null,
      event_type: type,
      created_by: uid,
    });
    if (!error) {
      setTitle(""); setStartsAt(""); setEndsAt(""); setLocation(""); setType("meeting");
      load();
    }
  }
  async function remove(id: string) {
    await supabase.from("calendar_events").delete().eq("id", id);
    load();
  }

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.starts_at).getTime() >= now);
  const past = events.filter((e) => new Date(e.starts_at).getTime() < now);

  return (
    <BoardPortalShell title="Calendar" subtitle="Board meetings, events, deadlines.">
      <form onSubmit={add} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" required className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="meeting">Meeting</option>
            <option value="event">Event</option>
            <option value="deadline">Deadline</option>
            <option value="training">Training</option>
          </select>
          <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location or link" className="rounded-xl border border-border bg-background px-3 py-2 text-sm md:col-span-2" />
        </div>
        <div className="mt-3 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe">
            <Plus className="h-4 w-4" strokeWidth={1.5} /> Add event
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <EventList title="Upcoming" events={upcoming} loading={loading} onRemove={remove} empty="No upcoming events." />
        <EventList title="Past" events={past} loading={loading} onRemove={remove} empty="No past events." />
      </div>
    </BoardPortalShell>
  );
}

function EventList({ title, events, loading, onRemove, empty }: { title: string; events: Ev[]; loading: boolean; onRemove: (id: string) => void; empty: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg">{title}</h2>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : events.length === 0 ? (
        <div className="grid place-items-center py-8 text-center">
          <CalendarCheck className="h-8 w-8 text-muted-foreground" strokeWidth={1} />
          <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border/60">
          {events.map((ev) => (
            <li key={ev.id} className="flex items-start gap-3 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{ev.title}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {ev.event_type} · {new Date(ev.starts_at).toLocaleString()}
                  {ev.ends_at ? ` – ${new Date(ev.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                </p>
                {ev.location && <p className="mt-1 text-xs text-muted-foreground">{ev.location}</p>}
              </div>
              <button onClick={() => onRemove(ev.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
