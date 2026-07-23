import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoardPortalShell } from "@/components/portal/BoardPortalShell";
import { Video, Plus, Trash2, Copy, Check, Users, X, Zap } from "lucide-react";

export const Route = createFileRoute("/board-portal/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Room — Board Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MeetingsPage,
});

type Meeting = {
  id: string;
  title: string;
  provider: string;
  meeting_link: string;
  passcode: string | null;
  host_id: string | null;
  host_name: string | null;
  scheduled_at: string;
  duration_min: number;
  agenda: string | null;
};

const JITSI_DOMAIN = "meet.jit.si";
const JITSI_SCRIPT = `https://${JITSI_DOMAIN}/external_api.js`;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

function newRoomName(title: string) {
  const base = slugify(title) || "meeting";
  const rand = Math.random().toString(36).slice(2, 8);
  return `LuxeNova-${base}-${rand}`;
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

function loadJitsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).JitsiMeetExternalAPI) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${JITSI_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Jitsi")));
      return;
    }
    const s = document.createElement("script");
    s.src = JITSI_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Jitsi"));
    document.body.appendChild(s);
  });
}

function roomFromLink(link: string): string {
  try {
    const u = new URL(link);
    return u.pathname.replace(/^\/+/, "");
  } catch {
    return link.replace(/^https?:\/\/[^/]+\//, "");
  }
}

function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(30);
  const [agenda, setAgenda] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);

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
      setUserEmail(user?.email ?? "");
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

  async function createMeeting(opts: { instant: boolean }) {
    if (!uid) return;
    const finalTitle = title.trim() || (opts.instant ? "Instant meeting" : "Board meeting");
    if (!opts.instant && !scheduledAt) return;
    setSaving(true);
    const room = newRoomName(finalTitle);
    const link = `https://${JITSI_DOMAIN}/${room}`;
    const when = opts.instant ? new Date().toISOString() : new Date(scheduledAt).toISOString();
    const { data, error } = await supabase
      .from("meetings")
      .insert({
        title: finalTitle,
        meeting_link: link,
        provider: "other",
        passcode: null,
        host_id: uid,
        host_name: displayName,
        scheduled_at: when,
        duration_min: opts.instant ? 60 : duration,
        agenda: agenda.trim() || null,
      })
      .select("*")
      .single();
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setTitle("");
    setScheduledAt("");
    setDuration(30);
    setAgenda("");
    await load();
    if (opts.instant && data) setActiveMeeting(data as Meeting);
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
      subtitle="Start or join live video meetings with the LuxeNova team — no external accounts required."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Upcoming meetings</h2>
              <span className="text-xs text-muted-foreground">{upcoming.length} scheduled</span>
            </div>
            {loading ? (
              <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
            ) : upcoming.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
                <Video className="mx-auto h-8 w-8 text-rosewood" strokeWidth={1.5} />
                <p className="mt-3 font-display text-lg">No meetings scheduled</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start an instant meeting or schedule one for later — everyone joins right here in the portal.
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
                    onJoin={() => setActiveMeeting(m)}
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
                    onJoin={() => setActiveMeeting(m)}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft h-fit lg:sticky lg:top-6">
          <button
            type="button"
            onClick={() => createMeeting({ instant: true })}
            disabled={saving || !uid}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-rosewood px-4 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe disabled:opacity-60"
          >
            <Zap className="h-4 w-4" strokeWidth={1.8} />
            {saving ? "Starting…" : "Start instant meeting"}
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground text-center">
            Creates a private room and opens the video call right here.
          </p>

          <div className="my-5 h-px bg-border" />

          <h2 className="font-display text-lg flex items-center gap-2">
            <Plus className="h-4 w-4 text-rosewood" strokeWidth={1.5} />
            Schedule for later
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMeeting({ instant: false });
            }}
            className="mt-3 space-y-3 text-sm"
          >
            <Field label="Title">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Monthly board sync"
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
              className="w-full rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft disabled:opacity-60"
            >
              {saving ? "Scheduling…" : "Schedule meeting"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-border/60 bg-background p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
              Built-in video
            </p>
            <p className="mt-1">
              Video, audio, screen share, and chat run right inside the portal. No downloads, no external accounts.
            </p>
          </div>
        </aside>
      </div>

      {activeMeeting && (
        <JitsiRoom
          meeting={activeMeeting}
          displayName={displayName}
          email={userEmail}
          onClose={() => setActiveMeeting(null)}
        />
      )}

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
  onJoin,
}: {
  m: Meeting;
  uid: string | null;
  past?: boolean;
  copied: boolean;
  onCopy: () => void;
  onRemove: () => void;
  onJoin: () => void;
}) {
  const canManage = uid && m.host_id === uid;
  return (
    <li className="rounded-2xl border border-border/70 bg-background p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-rosewood/10 px-2 py-0.5 text-[11px] font-medium text-rosewood">
              LuxeNova Video
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
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {!past && (
            <button
              type="button"
              onClick={onJoin}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe"
            >
              <Video className="h-4 w-4" strokeWidth={1.5} /> Join
            </button>
          )}
          <button
            type="button"
            onClick={onCopy}
            title="Copy invite link"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs shadow-soft"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Invite link"}
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
        </div>
      </div>
    </li>
  );
}

function JitsiRoom({
  meeting,
  displayName,
  email,
  onClose,
}: {
  meeting: Meeting;
  displayName: string;
  email: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    loadJitsiScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const Jitsi = (window as any).JitsiMeetExternalAPI;
        if (!Jitsi) {
          setStatus("error");
          return;
        }
        const room = roomFromLink(meeting.meeting_link);
        apiRef.current = new Jitsi(JITSI_DOMAIN, {
          roomName: room,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: {
            displayName: displayName || "LuxeNova member",
            email: email || undefined,
          },
          configOverwrite: {
            prejoinPageEnabled: true,
            disableDeepLinking: true,
            startWithAudioMuted: true,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: "#1a1414",
          },
        });
        apiRef.current.addListener("readyToClose", onClose);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));

    return () => {
      cancelled = true;
      try {
        apiRef.current?.dispose?.();
      } catch {}
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting.id]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="font-display text-base truncate">{meeting.title}</p>
          <p className="text-[11px] text-white/60 truncate">
            Room: {roomFromLink(meeting.meeting_link)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
        >
          <X className="h-4 w-4" /> Leave
        </button>
      </div>
      <div className="relative flex-1">
        {status === "loading" && (
          <div className="absolute inset-0 grid place-items-center text-white/80 text-sm">
            Loading video room…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 grid place-items-center text-white/80 text-sm px-6 text-center">
            Couldn't load the video room. Check your internet connection and try again.
          </div>
        )}
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
