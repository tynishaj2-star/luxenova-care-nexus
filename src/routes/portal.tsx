import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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
  Plus,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  listReferrals,
  getReferral,
  createReferral,
  updateReferralStatus,
  addReferralNote,
  getCurrentProfile,
} from "@/lib/referrals.functions";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Partner Portal — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Secure partner portal for submitting and tracking Emergency Stabilization Requests with LuxeNova Community Wellness.",
      },
    ],
  }),
  component: Portal,
});

type Status =
  | "New"
  | "In Review"
  | "Awaiting Documents"
  | "Navigator Assigned"
  | "Relief Delivered"
  | "Closed";

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

const URGENCY_TONE: Record<"Routine" | "Priority" | "Urgent", string> = {
  Routine: "text-muted-foreground",
  Priority: "text-amber-700",
  Urgent: "text-rosewood",
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Portal() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Auth gate (client-side; loader-free to avoid SSR token race)
  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
        search: { redirect: "/portal", mode: "signin" },
      });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-warm">
        <div className="text-sm text-muted-foreground">Checking session…</div>
      </div>
    );
  }
  return <PortalAuthed />;
}

function PortalAuthed() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listReferrals);
  const fetchProfile = useServerFn(getCurrentProfile);
  const fetchOne = useServerFn(getReferral);
  const createFn = useServerFn(createReferral);
  const setStatusFn = useServerFn(updateReferralStatus);
  const addNoteFn = useServerFn(addReferralNote);

  const profileQ = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  const listQ = useQuery({
    queryKey: ["referrals"],
    queryFn: () => fetchList(),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [showNew, setShowNew] = useState(false);

  const referrals = listQ.data ?? [];
  const filtered = useMemo(() => {
    return referrals
      .filter((r) => statusFilter === "All" || r.status === statusFilter)
      .filter((r) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          r.household.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          (r.submitter_org ?? "").toLowerCase().includes(q) ||
          r.primary_barrier.toLowerCase().includes(q) ||
          (r.zip ?? "").includes(q)
        );
      });
  }, [referrals, query, statusFilter]);

  // Auto-select first when list loads
  useEffect(() => {
    if (!selectedId && filtered.length > 0) setSelectedId(filtered[0].id);
  }, [selectedId, filtered]);

  const detailQ = useQuery({
    queryKey: ["referral", selectedId],
    queryFn: () => fetchOne({ data: { id: selectedId! } }),
    enabled: !!selectedId,
  });

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
      c[r.status as Status]++;
    });
    return c;
  }, [referrals]);

  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: Status }) =>
      setStatusFn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
      qc.invalidateQueries({ queryKey: ["referral", selectedId] });
    },
  });

  const noteMut = useMutation({
    mutationFn: (vars: { id: string; body: string }) => addNoteFn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
      qc.invalidateQueries({ queryKey: ["referral", selectedId] });
    },
  });

  const createMut = useMutation({
    mutationFn: (vars: {
      household: string;
      primary_barrier: string;
      zip: string;
      urgency: "Routine" | "Priority" | "Urgent";
      submitter_name: string;
      submitter_org: string;
      notes_intake: string;
    }) => createFn({ data: vars }),
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
      setSelectedId(row.id);
      setShowNew(false);
    },
  });

  const isStaff = profileQ.data?.isStaff;
  const detail = detailQ.data;
  const [draftNote, setDraftNote] = useState("");

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
              L
            </span>
            <span className="font-display text-lg">
              LuxeNova Community Wellness — Partner Portal
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
              {isStaff ? "Staff View" : "Partner View"} · Confidential
            </span>
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-4 py-2 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} /> New referral
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        {/* Intro */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">
            {isStaff ? "All referrals — end to end" : "Your organization's referrals"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {isStaff
              ? "Every Emergency Stabilization Request across LuxeNova partners, with live status, navigator assignment, and notes."
              : "Submit new referrals and follow each one through to relief delivered. You see only the referrals your account has submitted."}
          </p>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Open Requests", value: counts.All - counts.Closed, icon: Inbox, tone: "text-rosewood" },
            { label: "Urgent", value: referrals.filter((r) => r.urgency === "Urgent" && r.status !== "Closed").length, icon: AlertCircle, tone: "text-rosewood" },
            { label: "Awaiting Documents", value: counts["Awaiting Documents"], icon: FileText, tone: "text-amber-700" },
            { label: "Relief Delivered (lifetime)", value: counts["Relief Delivered"] + counts.Closed, icon: CheckCircle2, tone: "text-emerald-700" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k.label}</span>
                <k.icon className={`h-4 w-4 ${k.tone}`} strokeWidth={1.5} />
              </div>
              <p className="mt-3 font-display text-3xl">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
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

        {/* Split */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* List */}
          <section className="space-y-3 lg:col-span-5">
            {listQ.isLoading && (
              <div className="rounded-2xl border border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">
                Loading referrals…
              </div>
            )}
            {!listQ.isLoading && filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                {referrals.length === 0
                  ? "No referrals yet. Click \"New referral\" to submit your first one."
                  : "No referrals match your filters."}
              </div>
            )}
            {filtered.map((r) => {
              const active = selectedId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`group w-full rounded-2xl border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-luxe ${
                    active ? "border-rosewood/50 ring-2 ring-rosewood/20" : "border-border/70 hover:border-rosewood/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {r.id.slice(0, 8)}
                        </span>
                        <span className={`text-[11px] font-medium ${URGENCY_TONE[r.urgency as keyof typeof URGENCY_TONE]}`}>
                          · {r.urgency}
                        </span>
                      </div>
                      <h3 className="mt-1 truncate font-display text-lg">{r.household}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {r.primary_barrier}
                        {r.zip ? ` · ZIP ${r.zip}` : ""}
                      </p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-rosewood" strokeWidth={1.5} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_TONE[r.status as Status]}`}>
                      {r.status}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" strokeWidth={1.5} />
                        {r.navigator ?? "Unassigned"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.5} />
                        {formatRelative(r.updated_at)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Detail */}
          <section className="lg:col-span-7">
            {detail && (
              <div className="space-y-6 lg:sticky lg:top-6">
                <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {detail.referral.id.slice(0, 8)} · submitted {formatTimestamp(detail.referral.created_at)}
                      </p>
                      <h2 className="mt-1 font-display text-2xl md:text-3xl">{detail.referral.household}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {detail.referral.primary_barrier}
                        {detail.referral.zip ? ` · ZIP ${detail.referral.zip}` : ""} ·{" "}
                        <span className={URGENCY_TONE[detail.referral.urgency as keyof typeof URGENCY_TONE]}>
                          {detail.referral.urgency}
                        </span>
                      </p>
                    </div>
                    <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${STATUS_TONE[detail.referral.status as Status]}`}>
                      {detail.referral.status}
                    </span>
                  </div>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Submitted by</dt>
                      <dd className="mt-1 text-sm">{detail.referral.submitter_name ?? "—"}</dd>
                      <dd className="text-xs text-muted-foreground">{detail.referral.submitter_org ?? ""}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Navigator</dt>
                      <dd className="mt-1 text-sm">{detail.referral.navigator ?? "Unassigned"}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Last update</dt>
                      <dd className="mt-1 text-sm">{formatRelative(detail.referral.updated_at)}</dd>
                      <dd className="text-xs text-muted-foreground">{formatTimestamp(detail.referral.updated_at)}</dd>
                    </div>
                  </dl>

                  {isStaff && (
                    <div className="mt-6 border-t border-border/60 pt-5">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Move to status</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => statusMut.mutate({ id: detail.referral.id, status: s })}
                            disabled={detail.referral.status === s || statusMut.isPending}
                            className={`rounded-full border px-3 py-1.5 text-xs transition ${
                              detail.referral.status === s
                                ? "cursor-default border-rosewood bg-rosewood text-rosewood-foreground"
                                : "border-border bg-background text-foreground/80 hover:border-rosewood/40"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl">Notes & Timeline</h3>
                    <span className="text-xs text-muted-foreground">{detail.notes.length} entries</span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                    <label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      <MessageSquarePlus className="mr-1 inline h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
                      Add note
                    </label>
                    <textarea
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      rows={3}
                      placeholder="Update, clarification, or coordination note…"
                      className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[11px] text-muted-foreground">
                        Visible to LuxeNova staff and the submitting partner.
                      </p>
                      <button
                        onClick={() => {
                          if (!draftNote.trim()) return;
                          noteMut.mutate(
                            { id: detail.referral.id, body: draftNote.trim() },
                            { onSuccess: () => setDraftNote("") },
                          );
                        }}
                        disabled={!draftNote.trim() || noteMut.isPending}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-4 py-2 text-xs font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Post note
                      </button>
                    </div>
                  </div>

                  <ol className="mt-6 space-y-5">
                    {detail.notes.map((n) => (
                      <li key={n.id} className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <span className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-medium ${
                            n.is_system ? "bg-muted text-muted-foreground" : "bg-gradient-rosewood text-rosewood-foreground"
                          }`}>
                            {n.is_system ? "•" : "•"}
                          </span>
                          <span className="mt-1 w-px flex-1 bg-border" />
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-sm font-medium">
                              {n.is_system ? "System" : "Note"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              · {formatTimestamp(n.created_at)} ({formatRelative(n.created_at)})
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{n.body}</p>
                        </div>
                      </li>
                    ))}
                    {detail.notes.length === 0 && (
                      <p className="text-sm text-muted-foreground">No notes yet.</p>
                    )}
                  </ol>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* New referral modal */}
      {showNew && (
        <NewReferralModal
          onClose={() => setShowNew(false)}
          onSubmit={(vals) => createMut.mutate(vals)}
          submitting={createMut.isPending}
          error={createMut.error instanceof Error ? createMut.error.message : null}
          profile={profileQ.data?.profile}
        />
      )}
    </div>
  );
}

function NewReferralModal({
  onClose,
  onSubmit,
  submitting,
  error,
  profile,
}: {
  onClose: () => void;
  onSubmit: (vals: {
    household: string;
    primary_barrier: string;
    zip: string;
    urgency: "Routine" | "Priority" | "Urgent";
    submitter_name: string;
    submitter_org: string;
    notes_intake: string;
  }) => void;
  submitting: boolean;
  error: string | null;
  profile?: { full_name: string | null; organization: string | null } | null;
}) {
  const [household, setHousehold] = useState("");
  const [primaryBarrier, setPrimaryBarrier] = useState("Rent emergency / eviction risk");
  const [zip, setZip] = useState("");
  const [urgency, setUrgency] = useState<"Routine" | "Priority" | "Urgent">("Priority");
  const [submitterName, setSubmitterName] = useState(profile?.full_name ?? "");
  const [submitterOrg, setSubmitterOrg] = useState(profile?.organization ?? "");
  const [notesIntake, setNotesIntake] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-luxe">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-xl">New referral</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!household.trim() || !primaryBarrier.trim()) return;
            onSubmit({
              household: household.trim(),
              primary_barrier: primaryBarrier.trim(),
              zip: zip.trim(),
              urgency,
              submitter_name: submitterName.trim(),
              submitter_org: submitterOrg.trim(),
              notes_intake: notesIntake.trim(),
            });
          }}
          className="space-y-4 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Household / Family">
              <input value={household} onChange={(e) => setHousehold(e.target.value)} required placeholder="Carter Household (4)" className={inputCls} />
            </Field>
            <Field label="ZIP">
              <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="02118" className={inputCls} />
            </Field>
            <Field label="Primary barrier">
              <select value={primaryBarrier} onChange={(e) => setPrimaryBarrier(e.target.value)} className={inputCls}>
                {[
                  "Rent emergency / eviction risk",
                  "Utility shutoff notice",
                  "Autism family support gap",
                  "Food / essentials",
                  "Documentation / benefits",
                  "Multiple compounding barriers",
                  "Other",
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Urgency">
              <select value={urgency} onChange={(e) => setUrgency(e.target.value as "Routine" | "Priority" | "Urgent")} className={inputCls}>
                <option>Routine</option>
                <option>Priority</option>
                <option>Urgent</option>
              </select>
            </Field>
            <Field label="Submitter name">
              <input value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Submitter organization">
              <input value={submitterOrg} onChange={(e) => setSubmitterOrg(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label="Intake note (context, request, urgency details)">
            <textarea
              value={notesIntake}
              onChange={(e) => setNotesIntake(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
            />
          </Field>
          {error && (
            <p className="rounded-xl border border-rosewood/30 bg-accent/40 px-3 py-2 text-xs text-rosewood">{error}</p>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-5 py-2.5 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit referral"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
