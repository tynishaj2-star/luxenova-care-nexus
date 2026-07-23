import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoardPortalShell } from "@/components/portal/BoardPortalShell";
import { Video, Plus, Trash2, ExternalLink, Copy, Check, Users } from "lucide-react";

export const Route = createFileRoute("/board-portal/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Room — Board Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MeetingsPage,
});

type Provider = "google_meet" | "zoom" | "teams" | "other";

type Meeting = {
  id: string;
  title: string;
  provider: Provider;
  meeting_link: string;
  passcode: string | null;
  host_id: string | null;
  host_name: string | null;
  scheduled_at: string;
  duration_min: number;
  agenda: string | null;
};

const PROVIDER_LABEL: Record<Provider, string> = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  teams: "Microsoft Teams",
  other: "Other",
};

function detectProvider(url: string): Provider {
  const u = url.toLowerCase();
  if (u.includes("meet.google.com")) return "google_meet";
  if (u.includes("zoom.us") || u.includes("zoom.com")) return "zoom";
  if (u.includes("teams.microsoft.com") || u.includes("teams.live.com")) return "teams";
  return "other";
}

function fmtWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  // form state
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [passcode, setPasscode] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(30);
  const [agenda, setAgenda] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("meetings")
      .select("*")
      .order("scheduled_at", { ascending: true });
    setMeetings((data as Meeting[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      setUid(user?.id ?? null);
      if (user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();
        setDisplayName(
          (p?.full_name as string | undefined) ||
            (user.email?.split("@")[0] ?? "Staff member"),
        );
      }
      await load();
    })();

    const channel = supabase
      .channel("meetings-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meetings" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function addMeeting(e: React.FormEvent) {
    e.preventDefault();
    if (!uid || !title.trim() || !link.trim() || !scheduledAt) return;
    setSaving(true);
    const { error } = await supabase.from("meetings").insert({
      title: title.trim(),
      meeting_link: link.trim(),
      provider: detectProvider(link),
      passcode: passcode.trim() || null,
      host_id: uid,
      host_name: displayName,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_min: duration,
      agenda: agenda.trim() || null,
    });
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setTitle("");
    setLink("");
    setPasscode("");
    setScheduledAt("");
    setDuration(30);
    setAgenda("");
    load();
  }

  async function removeMeeting(id: string) {
    if (!confirm("Cancel this meeting?")) return;
    await supabase.from("meetings").delete().eq("id", id);
    load();
  }

  async function copyLink(m: Meeting) {
    try {
      await navigator.clipboard.writeText(m.meeting_link);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  }

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const up: Meeting[] = [];
    const pa: Meeting[] = [];
    for (const m of meetings) {
      const end = new Date(m.scheduled_at).getTime() + m.duration_min * 60_000;
      if (end >= now) up.push(m);
      else pa.push(m);
    }
    pa.reverse();
    return { upcoming: up, past: pa };
  }, [meetings]);

  return (
    <BoardPortalShell
      title="Meeting Room"
      subtitle="Schedule and join live video meetings with the LuxeNova team."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Upcoming meetings</h2>
              <span className="text-xs text-muted-foreground">
                {upcoming.length} scheduled
              </span>
            </div>
            {loading ? (
              <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
            ) : upcoming.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
                <Video className="mx-auto h-8 w-8 text-rosewood" strokeWidth={1.5} />
                <p className="mt-3 font-display text-lg">No meetings scheduled</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Paste a Google Meet, Zoom, or Teams link on the right to schedule one.
                </p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {upcoming.map((m) => (
                  <MeetingCard
                    key={m.id}
                    m={m}
                    uid={uid}
                    copied={copiedId === m.id}
                    onCopy={() => copyLink(m)}
                    onRemove={() => removeMeeting(m.id)}
                  />
                ))}
              </ul>
            )}
          </section>

          {past.length > 0 && (
            <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl">Past meetings</h2>
              <ul className="mt-4 space-y-3">
                {past.slice(0, 10).map((m) => (
                  <MeetingCard
                    key={m.id}
                    m={m}
                    uid={uid}
                    past
                    copied={copiedId === m.id}
                    onCopy={() => copyLink(m)}
                    onRemove={() => removeMeeting(m.id)}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft h-fit lg:sticky lg:top-6">
          <h2 className="font-display text-xl flex items-center gap-2">
            <Plus className="h-5 w-5 text-rosewood" strokeWidth={1.5} />
            Schedule a meeting
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Create the meeting in Google Meet, Zoom, or Teams, then paste the join link here.
          </p>
          <form onSubmit={addMeeting} className="mt-4 space-y-3 text-sm">
            <Field label="Title">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Monthly board sync"
                className="input"
              />
            </Field>
            <Field label="Meeting link">
              <input
                required
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                className="input"
              />
              {link && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Detected: {PROVIDER_LABEL[detectProvider(link)]}
                </p>
              )}
            </Field>
            <Field label="Passcode (optional)">
              <input
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. 123456"
                className="input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date & time">
                <input
                  required
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Duration (min)">
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 30)}
                  className="input"
                />
              </Field>
            </div>
            <Field label="Agenda (optional)">
              <textarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                rows={3}
                placeholder="What will you cover?"
                className="input"
              />
            </Field>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe disabled:opacity-60"
            >
              {saving ? "Scheduling…" : "Schedule meeting"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-border/60 bg-background p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
              How to create a link
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-4">
              <li>
                <a className="underline" href="https://meet.google.com/new" target="_blank" rel="noreferrer">
                  Start a Google Meet
                </a>{" "}
                and copy the URL.
              </li>
              <li>
                <a className="underline" href="https://zoom.us/meeting/schedule" target="_blank" rel="noreferrer">
                  Schedule a Zoom
                </a>{" "}
                and copy the join link.
              </li>
              <li>Or use any Microsoft Teams meeting URL.</li>
            </ul>
          </div>
        </aside>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus { outline: 2px solid hsl(var(--ring)); outline-offset: 1px; }
      `}</style>
    </BoardPortalShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function MeetingCard({
  m,
  uid,
  past,
  copied,
  onCopy,
  onRemove,
}: {
  m: Meeting;
  uid: string | null;
  past?: boolean;
  copied: boolean;
  onCopy: () => void;
  onRemove: () => void;
}) {
  const canManage = uid && m.host_id === uid;
  return (
    <li className="rounded-2xl border border-border/70 bg-background p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-rosewood/10 px-2 py-0.5 text-[11px] font-medium text-rosewood">
              {PROVIDER_LABEL[m.provider]}
            </span>
            <h3 className="font-display text-lg truncate">{m.title}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {fmtWhen(m.scheduled_at)} · {m.duration_min} min
            {m.host_name ? ` · Hosted by ${m.host_name}` : ""}
          </p>
          {m.agenda && (
            <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">{m.agenda}</p>
          )}
          {m.passcode && (
            <p className="mt-1 text-xs text-muted-foreground">
              Passcode: <span className="font-mono">{m.passcode}</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {!past && (
            <a
              href={m.meeting_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe"
            >
              <Video className="h-4 w-4" strokeWidth={1.5} /> Join
            </a>
          )}
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs shadow-soft"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          {canManage && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-background px-3 py-2 text-xs text-destructive"
              aria-label="Cancel meeting"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          {past && (
            <a
              href={m.meeting_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Link
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
