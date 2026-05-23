import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Clock,
  MessageSquarePlus,
  ChevronRight,
  Users,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Send,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Referral Tracking Dashboard — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "End-to-end referral tracking for LuxeNova staff and community partners — statuses, notes, and timestamps for every stabilization request.",
      },
    ],
  }),
  component: Portal,
});

// ---------- Types ----------
type Status =
  | "New"
  | "In Review"
  | "Awaiting Documents"
  | "Navigator Assigned"
  | "Relief Delivered"
  | "Closed";

type Note = {
  id: string;
  author: string;
  authorRole: "Staff" | "Partner";
  body: string;
  createdAt: string; // ISO
};

type Referral = {
  id: string;
  household: string;
  submittedBy: string;
  submitterOrg: string;
  zip: string;
  primaryBarrier: string;
  urgency: "Routine" | "Priority" | "Urgent";
  status: Status;
  navigator: string | null;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
};

// ---------- Constants ----------
const STATUSES: Status[] = [
  "New",
  "In Review",
  "Awaiting Documents",
  "Navigator Assigned",
  "Relief Delivered",
  "Closed",
];

const STATUS_TONE: Record<Status, string> = {
  New: "bg-accent text-rosewood border-rosewood/30",
  "In Review": "bg-amber-50 text-amber-800 border-amber-200",
  "Awaiting Documents": "bg-orange-50 text-orange-800 border-orange-200",
  "Navigator Assigned": "bg-blue-50 text-blue-800 border-blue-200",
  "Relief Delivered": "bg-emerald-50 text-emerald-800 border-emerald-200",
  Closed: "bg-muted text-muted-foreground border-border",
};

const URGENCY_TONE: Record<Referral["urgency"], string> = {
  Routine: "text-muted-foreground",
  Priority: "text-amber-700",
  Urgent: "text-rosewood",
};

// ---------- Seed data ----------
const now = Date.now();
const hours = (h: number) => new Date(now - h * 3600_000).toISOString();

const SEED: Referral[] = [
  {
    id: "REF-2041",
    household: "Carter Household (4)",
    submittedBy: "M. Alvarez",
    submitterOrg: "Lincoln Elementary",
    zip: "02118",
    primaryBarrier: "Rent emergency / eviction risk",
    urgency: "Urgent",
    status: "Navigator Assigned",
    navigator: "Tynisha Johnson",
    createdAt: hours(28),
    updatedAt: hours(2),
    notes: [
      { id: "n1", author: "M. Alvarez", authorRole: "Partner", body: "Family received 14-day NTQ. Two children enrolled at Lincoln.", createdAt: hours(28) },
      { id: "n2", author: "Tynisha Johnson", authorRole: "Staff", body: "Intake reviewed. Requesting partial rent assistance from stabilization fund.", createdAt: hours(6) },
      { id: "n3", author: "Tynisha Johnson", authorRole: "Staff", body: "Spoke with landlord — agreed to hold eviction pending Friday payment.", createdAt: hours(2) },
    ],
  },
  {
    id: "REF-2040",
    household: "Nguyen Household (3)",
    submittedBy: "J. Patel",
    submitterOrg: "Roxbury Family Resource Center",
    zip: "02119",
    primaryBarrier: "Utility shutoff notice",
    urgency: "Priority",
    status: "Awaiting Documents",
    navigator: "Latoia Moses",
    createdAt: hours(52),
    updatedAt: hours(9),
    notes: [
      { id: "n4", author: "J. Patel", authorRole: "Partner", body: "Eversource shutoff scheduled in 7 days.", createdAt: hours(52) },
      { id: "n5", author: "Latoia Moses", authorRole: "Staff", body: "Requested signed HIPAA auth + most recent utility bill.", createdAt: hours(9) },
    ],
  },
  {
    id: "REF-2039",
    household: "Rivera Household (5)",
    submittedBy: "Self",
    submitterOrg: "—",
    zip: "02121",
    primaryBarrier: "Autism family support gap",
    urgency: "Routine",
    status: "In Review",
    navigator: null,
    createdAt: hours(70),
    updatedAt: hours(18),
    notes: [
      { id: "n6", author: "Family", authorRole: "Partner", body: "Need help navigating IEP process and respite resources.", createdAt: hours(70) },
      { id: "n7", author: "Victoria Roscoe", authorRole: "Staff", body: "Reviewing for navigator match. Flagging for autism family support track.", createdAt: hours(18) },
    ],
  },
  {
    id: "REF-2038",
    household: "Okafor Household (2)",
    submittedBy: "Rev. T. Hill",
    submitterOrg: "Grace Community Church",
    zip: "02124",
    primaryBarrier: "Multiple compounding barriers",
    urgency: "Urgent",
    status: "Relief Delivered",
    navigator: "Tynisha Johnson",
    createdAt: hours(120),
    updatedAt: hours(20),
    notes: [
      { id: "n8", author: "Rev. T. Hill", authorRole: "Partner", body: "Mother and infant in temporary stay, no food, utilities at risk.", createdAt: hours(120) },
      { id: "n9", author: "Tynisha Johnson", authorRole: "Staff", body: "Emergency grocery + utility relief disbursed. Coordinating housing referral.", createdAt: hours(20) },
    ],
  },
  {
    id: "REF-2037",
    household: "Brown Household (1)",
    submittedBy: "Self",
    submitterOrg: "—",
    zip: "02125",
    primaryBarrier: "Documentation / benefits",
    urgency: "Routine",
    status: "New",
    navigator: null,
    createdAt: hours(4),
    updatedAt: hours(4),
    notes: [
      { id: "n10", author: "Family", authorRole: "Partner", body: "Need help re-establishing SNAP benefits after move.", createdAt: hours(4) },
    ],
  },
];

const STORAGE_KEY = "luxenova.referrals.v1";

// ---------- Helpers ----------
function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------- Page ----------
function Portal() {
  const [referrals, setReferrals] = useState<Referral[]>(() => {
    if (typeof window === "undefined") return SEED;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Referral[]) : SEED;
    } catch {
      return SEED;
    }
  });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [selectedId, setSelectedId] = useState<string>(SEED[0].id);
  const [draftNote, setDraftNote] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(referrals));
    } catch {
      /* noop */
    }
  }, [referrals]);

  const filtered = useMemo(() => {
    return referrals
      .filter((r) => statusFilter === "All" || r.status === statusFilter)
      .filter((r) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          r.household.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.submitterOrg.toLowerCase().includes(q) ||
          r.primaryBarrier.toLowerCase().includes(q) ||
          r.zip.includes(q)
        );
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [referrals, query, statusFilter]);

  const selected = referrals.find((r) => r.id === selectedId) ?? filtered[0];

  const counts = useMemo(() => {
    const c: Record<Status | "All", number> = {
      All: referrals.length,
      New: 0,
      "In Review": 0,
      "Awaiting Documents": 0,
      "Navigator Assigned": 0,
      "Relief Delivered": 0,
      Closed: 0,
    };
    referrals.forEach((r) => {
      c[r.status]++;
    });
    return c;
  }, [referrals]);

  const updateStatus = (id: string, status: Status) => {
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedAt: new Date().toISOString(),
              notes: [
                {
                  id: `n-${Date.now()}`,
                  author: "You (Staff)",
                  authorRole: "Staff",
                  body: `Status changed to "${status}".`,
                  createdAt: new Date().toISOString(),
                },
                ...r.notes,
              ],
            }
          : r,
      ),
    );
  };

  const addNote = () => {
    if (!selected || !draftNote.trim()) return;
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              updatedAt: new Date().toISOString(),
              notes: [
                {
                  id: `n-${Date.now()}`,
                  author: "You (Staff)",
                  authorRole: "Staff",
                  body: draftNote.trim(),
                  createdAt: new Date().toISOString(),
                },
                ...r.notes,
              ],
            }
          : r,
      ),
    );
    setDraftNote("");
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
              L
            </span>
            <span className="font-display text-lg">
              LuxeNova Community Wellness — Referral Tracking
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
              Confidential · Staff & Partner View
            </span>
            <Link
              to="/"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        {/* Page intro */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">
            Referral Tracking — end to end
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Every Emergency Stabilization Request, with live status, navigator
            assignment, partner notes, and timestamps. Visible to LuxeNova
            staff and submitting community partners.
          </p>
        </div>

        {/* KPI Row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Open Requests", value: counts.All - counts.Closed, icon: Inbox, tone: "text-rosewood" },
            { label: "Urgent", value: referrals.filter((r) => r.urgency === "Urgent" && r.status !== "Closed").length, icon: AlertCircle, tone: "text-rosewood" },
            { label: "Awaiting Documents", value: counts["Awaiting Documents"], icon: FileText, tone: "text-amber-700" },
            { label: "Relief Delivered (lifetime)", value: counts["Relief Delivered"] + counts.Closed, icon: CheckCircle2, tone: "text-emerald-700" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {k.label}
                </span>
                <k.icon className={`h-4 w-4 ${k.tone}`} strokeWidth={1.5} />
              </div>
              <p className="mt-3 font-display text-3xl">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search household, ID, partner, ZIP…"
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  statusFilter === s
                    ? "border-rosewood bg-rosewood text-rosewood-foreground"
                    : "border-border bg-background text-foreground/80 hover:border-foreground/30"
                }`}
              >
                {s} <span className="opacity-70">· {counts[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Split layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Referral list */}
          <section className="lg:col-span-5 space-y-3">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                No referrals match your filters.
              </div>
            )}
            {filtered.map((r) => {
              const active = selected?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`group w-full rounded-2xl border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-luxe ${
                    active
                      ? "border-rosewood/50 ring-2 ring-rosewood/20"
                      : "border-border/70 hover:border-rosewood/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {r.id}
                        </span>
                        <span className={`text-[11px] font-medium ${URGENCY_TONE[r.urgency]}`}>
                          · {r.urgency}
                        </span>
                      </div>
                      <h3 className="mt-1 truncate font-display text-lg">{r.household}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {r.primaryBarrier} · ZIP {r.zip}
                      </p>
                    </div>
                    <ChevronRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-rosewood"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_TONE[r.status]}`}
                    >
                      {r.status}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" strokeWidth={1.5} />
                        {r.navigator ?? "Unassigned"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.5} />
                        {formatRelative(r.updatedAt)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Detail panel */}
          <section className="lg:col-span-7">
            {selected && (
              <div className="space-y-6 lg:sticky lg:top-6">
                {/* Header card */}
                <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {selected.id} · submitted {formatTimestamp(selected.createdAt)}
                      </p>
                      <h2 className="mt-1 font-display text-2xl md:text-3xl">
                        {selected.household}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selected.primaryBarrier} · ZIP {selected.zip} ·{" "}
                        <span className={URGENCY_TONE[selected.urgency]}>{selected.urgency}</span>
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${STATUS_TONE[selected.status]}`}
                    >
                      {selected.status}
                    </span>
                  </div>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Submitted by
                      </dt>
                      <dd className="mt-1 text-sm">{selected.submittedBy}</dd>
                      <dd className="text-xs text-muted-foreground">{selected.submitterOrg}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Navigator
                      </dt>
                      <dd className="mt-1 text-sm">{selected.navigator ?? "Unassigned"}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Last update
                      </dt>
                      <dd className="mt-1 text-sm">{formatRelative(selected.updatedAt)}</dd>
                      <dd className="text-xs text-muted-foreground">
                        {formatTimestamp(selected.updatedAt)}
                      </dd>
                    </div>
                  </dl>

                  {/* Status changer */}
                  <div className="mt-6 border-t border-border/60 pt-5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Move to status
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selected.id, s)}
                          disabled={selected.status === s}
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${
                            selected.status === s
                              ? "cursor-default border-rosewood bg-rosewood text-rosewood-foreground"
                              : "border-border bg-background text-foreground/80 hover:border-rosewood/40"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes & timeline */}
                <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl">Notes & Timeline</h3>
                    <span className="text-xs text-muted-foreground">
                      {selected.notes.length} entries
                    </span>
                  </div>

                  {/* Compose */}
                  <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                    <label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      <MessageSquarePlus className="mr-1 inline h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
                      Add internal note
                    </label>
                    <textarea
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      rows={3}
                      placeholder="e.g. Spoke with landlord, payment plan agreed for Friday."
                      className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[11px] text-muted-foreground">
                        Visible to LuxeNova staff and the submitting partner.
                      </p>
                      <button
                        onClick={addNote}
                        disabled={!draftNote.trim()}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-4 py-2 text-xs font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Post note
                      </button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <ol className="mt-6 space-y-5">
                    {selected.notes.map((n) => (
                      <li key={n.id} className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <span
                            className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-medium ${
                              n.authorRole === "Staff"
                                ? "bg-gradient-rosewood text-rosewood-foreground"
                                : "bg-accent text-rosewood"
                            }`}
                          >
                            {n.author
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <span className="mt-1 w-px flex-1 bg-border" />
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-sm font-medium">{n.author}</span>
                            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                              {n.authorRole}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              · {formatTimestamp(n.createdAt)} ({formatRelative(n.createdAt)})
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
                            {n.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-12 rounded-3xl border border-border/70 bg-card p-6 text-sm text-muted-foreground shadow-soft">
          <p>
            <ShieldCheck className="mr-1 inline h-4 w-4 text-rosewood" strokeWidth={1.5} />
            This preview persists locally for demonstration. To enable
            multi-user accounts, secure document storage, and shared
            partner access across devices, activate Lovable Cloud.
          </p>
        </div>
      </main>
    </div>
  );
}
