import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  Search,
  LogOut,
  LayoutDashboard,
  Inbox,
  Utensils,
  HandHeart,
  Mail,
  Building2,
  FileText,
  TrendingUp,
  Settings as SettingsIcon,
  AlertCircle,
  CheckCircle2,
  FileWarning,
  ShoppingBasket,
  HeartHandshake,
  XCircle,
  Clock,
  Send,
  Printer,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listReferrals,
  getReferral,
  updateReferralStatus,
  addReferralNote,
} from "@/lib/referrals.functions";
import {
  inviteUser,
  createEmployeeAccount,
  listRoleRequests,
  decideRoleRequest,
} from "@/lib/admin.functions";
import { ExecutiveDirectorSection } from "./ExecutiveDirectorSection";
import { OperationsSection } from "./OperationsSection";
import { Crown, Eye, Activity } from "lucide-react";
import { STAFF_DIRECTORY, type JobRole, JOB_ROLE_LABEL } from "@/lib/staff-roles";
import { StaffWorkspaceShell } from "./StaffWorkspaceShell";

type Status =
  | "New"
  | "In Review"
  | "Awaiting Documents"
  | "Navigator Assigned"
  | "Relief Delivered"
  | "Closed"
  | "Missing Documents"
  | "Partner Referral Needed"
  | "Food / Essentials Support"
  | "Sponsor Match Needed"
  | "Completed";

const ALL_STATUSES: Status[] = [
  "New",
  "In Review",
  "Missing Documents",
  "Partner Referral Needed",
  "Food / Essentials Support",
  "Sponsor Match Needed",
  "Navigator Assigned",
  "Relief Delivered",
  "Completed",
  "Closed",
];

const STATUS_LABEL: Record<Status, string> = {
  New: "New Request",
  "In Review": "Under Review",
  "Awaiting Documents": "Missing Documents",
  "Missing Documents": "Missing Documents",
  "Partner Referral Needed": "Partner Referral Needed",
  "Food / Essentials Support": "Food / Essentials Support",
  "Sponsor Match Needed": "Sponsor Match Needed",
  "Navigator Assigned": "Navigator Assigned",
  "Relief Delivered": "Relief Delivered",
  Completed: "Completed",
  Closed: "Closed",
};

const STATUS_TONE: Record<Status, string> = {
  New: "bg-accent text-rosewood border-rosewood/30",
  "In Review": "bg-amber-50 text-amber-800 border-amber-200",
  "Awaiting Documents": "bg-orange-50 text-orange-800 border-orange-200",
  "Missing Documents": "bg-orange-50 text-orange-800 border-orange-200",
  "Partner Referral Needed": "bg-sky-50 text-sky-800 border-sky-200",
  "Food / Essentials Support": "bg-lime-50 text-lime-800 border-lime-200",
  "Sponsor Match Needed": "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
  "Navigator Assigned": "bg-blue-50 text-blue-800 border-blue-200",
  "Relief Delivered": "bg-emerald-50 text-emerald-800 border-emerald-200",
  Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Closed: "bg-muted text-muted-foreground border-border",
};

const URGENCY_TONE: Record<"Routine" | "Priority" | "Urgent", string> = {
  Routine: "text-muted-foreground",
  Priority: "text-amber-700",
  Urgent: "text-rosewood",
};

type SectionId =
  | "executive"
  | "overview"
  | "operations"
  | "requests"
  | "food-drives"
  | "volunteers"
  | "contact"
  | "sponsors"
  | "documents"
  | "impact"
  | "settings";

const NAV: { id: SectionId; label: string; icon: typeof Inbox }[] = [
  { id: "executive", label: "Executive Director", icon: Crown },
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "operations", label: "Operations", icon: Activity },
  { id: "requests", label: "Requests", icon: Inbox },
  { id: "food-drives", label: "Food Drives", icon: Utensils },
  { id: "volunteers", label: "Volunteers", icon: HandHeart },
  { id: "contact", label: "Contact Messages", icon: Mail },
  { id: "sponsors", label: "Sponsors / Partners", icon: Building2 },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "impact", label: "Impact", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminDashboard({
  profile,
}: {
  profile: { full_name?: string | null; organization?: string | null } | null;
}) {
  const qc = useQueryClient();
  const fetchList = useServerFn(listReferrals);
  const fetchOne = useServerFn(getReferral);
  const setStatusFn = useServerFn(updateReferralStatus);
  const addNoteFn = useServerFn(addReferralNote);

  const [section, setSection] = useState<SectionId>("executive");
  const [previewRole, setPreviewRole] = useState<JobRole | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [urgencyFilter, setUrgencyFilter] = useState<"All" | "Routine" | "Priority" | "Urgent">("All");
  const [draftNote, setDraftNote] = useState("");

  const listQ = useQuery({
    queryKey: ["referrals"],
    queryFn: () => fetchList(),
  });
  const referrals = listQ.data ?? [];

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      total: referrals.length,
      New: 0,
      "In Review": 0,
      "Missing Documents": 0,
      "Awaiting Documents": 0,
      "Partner Referral Needed": 0,
      "Food / Essentials Support": 0,
      "Sponsor Match Needed": 0,
      "Navigator Assigned": 0,
      "Relief Delivered": 0,
      Completed: 0,
      Closed: 0,
    };
    referrals.forEach((r) => {
      c[r.status] = (c[r.status] ?? 0) + 1;
    });
    return c;
  }, [referrals]);

  const filtered = useMemo(() => {
    return referrals
      .filter((r) => statusFilter === "All" || r.status === statusFilter)
      .filter((r) => urgencyFilter === "All" || r.urgency === urgencyFilter)
      .filter((r) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          r.household.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          (r.submitter_name ?? "").toLowerCase().includes(q) ||
          (r.submitter_org ?? "").toLowerCase().includes(q) ||
          r.primary_barrier.toLowerCase().includes(q) ||
          (r.zip ?? "").includes(q)
        );
      });
  }, [referrals, query, statusFilter, urgencyFilter]);

  const detailQ = useQuery({
    queryKey: ["referral", selectedId],
    queryFn: () => fetchOne({ data: { id: selectedId! } }),
    enabled: !!selectedId,
  });

  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: Status }) => setStatusFn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
      qc.invalidateQueries({ queryKey: ["referral", selectedId] });
    },
  });

  const noteMut = useMutation({
    mutationFn: (vars: { id: string; body: string }) => addNoteFn({ data: vars }),
    onSuccess: () => {
      setDraftNote("");
      qc.invalidateQueries({ queryKey: ["referrals"] });
      qc.invalidateQueries({ queryKey: ["referral", selectedId] });
    },
  });

  // Admin "View as" preview — re-render any staff member's workspace read-only.
  if (previewRole && previewRole !== "admin") {
    const member = STAFF_DIRECTORY.find((s) => s.jobRole === previewRole);
    return (
      <StaffWorkspaceShell
        role={previewRole as JobRole}
        viewerName={member?.name ?? "Staff"}
        viewerTitle={member?.title ?? ""}
        previewing
        onExitPreview={() => setPreviewRole("")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
              L
            </span>
            <span className="font-display text-lg">
              LuxeNova Community Wellness, Inc. — Admin Intake Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <label className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <Eye className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
              View as
              <select
                value={previewRole}
                onChange={(e) => setPreviewRole(e.target.value as JobRole | "")}
                className="rounded-md border border-border bg-background px-2 py-0.5 text-xs"
              >
                <option value="">— myself (Admin) —</option>
                {STAFF_DIRECTORY.filter((s) => s.jobRole !== "admin").map((s) => (
                  <option key={s.email} value={s.jobRole}>
                    {s.name} ({JOB_ROLE_LABEL[s.jobRole]})
                  </option>
                ))}
              </select>
            </label>
            <span className="hidden items-center gap-1.5 rounded-full border border-rosewood/30 bg-accent px-3 py-1.5 text-xs text-rosewood sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              Admin · Confidential
            </span>
            <div className="hidden text-right sm:block">
              <div className="text-sm">{profile?.full_name || "Staff member"}</div>
              <div className="text-[11px] text-muted-foreground">
                {profile?.organization || "LuxeNova Community Wellness, Inc."}
              </div>
            </div>
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

      <div className="mx-auto grid max-w-[1500px] gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="rounded-2xl border border-border/70 bg-card p-2 shadow-soft">
            {NAV.map((item) => {
              const active = section === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                    active
                      ? "bg-gradient-rosewood text-rosewood-foreground shadow-luxe"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          {section === "executive" && <ExecutiveDirectorSection />}
          {section === "overview" && <OverviewSection counts={counts} referrals={referrals} onJump={(s) => { setSection("requests"); setStatusFilter(s); }} />}

          {section === "requests" && (
            <RequestsSection
              listLoading={listQ.isLoading}
              referrals={referrals}
              filtered={filtered}
              counts={counts}
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              urgencyFilter={urgencyFilter}
              setUrgencyFilter={setUrgencyFilter}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              detail={detailQ.data}
              detailLoading={detailQ.isLoading}
              onStatus={(id, status) => statusMut.mutate({ id, status })}
              draftNote={draftNote}
              setDraftNote={setDraftNote}
              onAddNote={(id, body) => noteMut.mutate({ id, body })}
              addingNote={noteMut.isPending}
            />
          )}

          {section === "food-drives" && (
            <ComingSoonSection
              icon={Utensils}
              title="Food Drive Interest Forms"
              body="Submissions from the public Food Drives page will appear here as drive RSVPs, donor pickups, and pantry requests."
              ctaHref="/food-drives"
              ctaLabel="Open public Food Drives page"
            />
          )}
          {section === "volunteers" && (
            <ComingSoonSection
              icon={HandHeart}
              title="Volunteer / Get Involved Forms"
              body="Volunteer signups and 'Get Involved' inquiries will be listed here with role interest, availability, and assignment status."
              ctaHref="/careers"
              ctaLabel="Open public Get Involved page"
            />
          )}
          {section === "contact" && (
            <ComingSoonSection
              icon={Mail}
              title="Contact Messages"
              body="Messages from the Contact page will land here so staff can triage, reply, and convert into a Request when appropriate."
              ctaHref="/contact"
              ctaLabel="Open public Contact page"
            />
          )}
          {section === "sponsors" && (
            <ComingSoonSection
              icon={Building2}
              title="Sponsor / Partner Inquiries"
              body="Sponsor-a-family pledges and community partner applications will be tracked here with status, contact owner, and pledged amounts."
              ctaHref="/sponsor-a-family"
              ctaLabel="Open Sponsor a Family page"
            />
          )}
          {section === "documents" && (
            <ComingSoonSection
              icon={FileText}
              title="Uploaded Documents"
              body="ID verification, proof of need, lease agreements, and other supporting documents uploaded per request will be browsable and downloadable here."
            />
          )}
          {section === "impact" && (
            <ComingSoonSection
              icon={TrendingUp}
              title="Impact Tracking"
              body="Households served, dollars deployed, food pounds distributed, and partner referrals fulfilled — aggregated for board reports and grant deliverables."
              ctaHref="/impact"
              ctaLabel="Open public Impact page"
            />
          )}
          {section === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({
  counts,
  referrals,
  onJump,
}: {
  counts: Record<string, number>;
  referrals: any[];
  onJump: (s: Status | "All") => void;
}) {
  const cards: { label: string; value: number; icon: typeof Inbox; tone: string; status: Status | "All" }[] = [
    { label: "Total Requests", value: counts.total, icon: Inbox, tone: "text-rosewood", status: "All" },
    { label: "New Requests", value: counts.New, icon: AlertCircle, tone: "text-rosewood", status: "New" },
    { label: "Under Review", value: counts["In Review"], icon: Clock, tone: "text-amber-700", status: "In Review" },
    { label: "Missing Documents", value: (counts["Missing Documents"] ?? 0) + (counts["Awaiting Documents"] ?? 0), icon: FileWarning, tone: "text-orange-700", status: "Missing Documents" },
    { label: "Food / Essentials Support", value: counts["Food / Essentials Support"], icon: ShoppingBasket, tone: "text-lime-700", status: "Food / Essentials Support" },
    { label: "Sponsor Match Needed", value: counts["Sponsor Match Needed"], icon: HeartHandshake, tone: "text-fuchsia-700", status: "Sponsor Match Needed" },
    { label: "Completed", value: (counts.Completed ?? 0) + (counts["Relief Delivered"] ?? 0), icon: CheckCircle2, tone: "text-emerald-700", status: "Completed" },
    { label: "Closed", value: counts.Closed, icon: XCircle, tone: "text-muted-foreground", status: "Closed" },
  ];

  const recent = [...referrals].slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Overview</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Intake at a glance</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Live snapshot of every Emergency Stabilization Request and support inquiry routed to LuxeNova staff.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((k) => (
          <button
            key={k.label}
            onClick={() => onJump(k.status)}
            className="rounded-2xl border border-border/70 bg-card p-5 text-left shadow-soft transition hover:border-rosewood/40 hover:shadow-luxe"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k.label}</span>
              <k.icon className={`h-4 w-4 ${k.tone}`} strokeWidth={1.5} />
            </div>
            <p className="mt-3 font-display text-3xl">{k.value}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg">Recent submissions</h2>
          <button
            onClick={() => onJump("All")}
            className="inline-flex items-center gap-1 text-xs text-rosewood hover:underline"
          >
            View all <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.household}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.submitter_org || r.submitter_name || "Direct intake"} · {formatDate(r.created_at)}
                  </div>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${STATUS_TONE[r.status as Status] ?? STATUS_TONE.New}`}>
                  {STATUS_LABEL[r.status as Status] ?? r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function RequestsSection(props: {
  listLoading: boolean;
  referrals: any[];
  filtered: any[];
  counts: Record<string, number>;
  query: string;
  setQuery: (v: string) => void;
  statusFilter: Status | "All";
  setStatusFilter: (v: Status | "All") => void;
  urgencyFilter: "All" | "Routine" | "Priority" | "Urgent";
  setUrgencyFilter: (v: "All" | "Routine" | "Priority" | "Urgent") => void;
  selectedId: string | null;
  setSelectedId: (v: string | null) => void;
  detail: any;
  detailLoading: boolean;
  onStatus: (id: string, status: Status) => void;
  draftNote: string;
  setDraftNote: (v: string) => void;
  onAddNote: (id: string, body: string) => void;
  addingNote: boolean;
}) {
  const {
    listLoading, referrals, filtered, counts, query, setQuery,
    statusFilter, setStatusFilter, urgencyFilter, setUrgencyFilter,
    selectedId, setSelectedId, detail, detailLoading, onStatus,
    draftNote, setDraftNote, onAddNote, addingNote,
  } = props;

  const r = detail?.referral;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Requests</p>
        <h1 className="mt-2 font-display text-3xl">All form submissions</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every Support Request and partner-submitted referral, end to end. Update status, assign navigators, and log internal notes.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, ID, partner, ZIP…"
            className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
          />
        </div>
        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value as any)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
        >
          <option value="All">All urgencies</option>
          <option value="Urgent">Urgent</option>
          <option value="Priority">Priority</option>
          <option value="Routine">Routine</option>
        </select>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-1.5">
        {(["All", ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              statusFilter === s
                ? "border-rosewood bg-rosewood text-rosewood-foreground"
                : "border-border bg-card text-foreground/80 hover:border-foreground/30"
            }`}
          >
            {s === "All" ? "All" : STATUS_LABEL[s as Status]}{" "}
            <span className="opacity-70">
              · {s === "All" ? counts.total : counts[s as string] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Table */}
        <section className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-border/60 bg-muted/40 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>Household / Submitter</span>
              <span>Urgency</span>
              <span>Status</span>
            </div>
            {listLoading && (
              <div className="p-10 text-center text-sm text-muted-foreground">Loading requests…</div>
            )}
            {!listLoading && filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                {referrals.length === 0 ? "No requests yet." : "No requests match your filters."}
              </div>
            )}
            <ul className="divide-y divide-border/60">
              {filtered.map((row) => {
                const active = selectedId === row.id;
                return (
                  <li key={row.id}>
                    <button
                      onClick={() => setSelectedId(row.id)}
                      className={`grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-left text-sm transition ${
                        active ? "bg-accent/60" : "hover:bg-accent/30"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{row.household}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {(row.submitter_org || row.submitter_name || "Direct intake")} ·{" "}
                          {row.zip ? `ZIP ${row.zip}` : "no ZIP"} · {formatDate(row.created_at)}
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${URGENCY_TONE[row.urgency as keyof typeof URGENCY_TONE]}`}>
                        {row.urgency}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${STATUS_TONE[row.status as Status] ?? STATUS_TONE.New}`}>
                        {STATUS_LABEL[row.status as Status] ?? row.status}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Detail */}
        <aside className="lg:col-span-5">
          {!selectedId && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Select a request to view full submission, notes, and actions.
            </div>
          )}
          {selectedId && (detailLoading || !r) && (
            <div className="rounded-2xl border border-border/70 bg-card p-10 text-center text-sm text-muted-foreground shadow-soft">
              Loading…
            </div>
          )}
          {selectedId && r && (
            <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-xl">{r.household}</h2>
                  <p className="text-xs text-muted-foreground">
                    ID {r.id.slice(0, 8)} · Submitted {formatDate(r.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                  title="Print / download record"
                >
                  <Printer className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Submitter">{r.submitter_name || "—"}</Field>
                <Field label="Organization">{r.submitter_org || "—"}</Field>
                <Field label="Primary barrier">{r.primary_barrier}</Field>
                <Field label="ZIP">{r.zip || "—"}</Field>
                <Field label="Urgency">
                  <span className={URGENCY_TONE[r.urgency as keyof typeof URGENCY_TONE]}>{r.urgency}</span>
                </Field>
                <Field label="Status">
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] ${STATUS_TONE[r.status as Status] ?? STATUS_TONE.New}`}>
                    {STATUS_LABEL[r.status as Status] ?? r.status}
                  </span>
                </Field>
                <Field label="Navigator">{r.navigator || "Unassigned"}</Field>
                <Field label="Last update">{formatDate(r.updated_at)}</Field>
              </dl>

              {r.notes_intake && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Intake notes</p>
                  <p className="mt-1 whitespace-pre-wrap rounded-xl border border-border/60 bg-muted/30 p-3 text-sm">
                    {r.notes_intake}
                  </p>
                </div>
              )}

              {/* Status actions */}
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Update status</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatus(r.id, s)}
                      disabled={r.status === s}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                        r.status === s
                          ? "border-rosewood bg-rosewood text-rosewood-foreground"
                          : "border-border bg-background hover:border-foreground/30"
                      }`}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign navigator (placeholder until staff-pool table exists) */}
              <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
                title="Navigator pool coming soon"
              >
                <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} /> Assign navigator (coming soon)
              </button>

              {/* Notes */}
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Internal notes ({detail?.notes?.length ?? 0})
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <textarea
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      placeholder="Add an internal note…"
                      rows={2}
                      className="flex-1 rounded-xl border border-border bg-background p-2 text-sm outline-none focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
                    />
                    <button
                      onClick={() => draftNote.trim() && onAddNote(r.id, draftNote.trim())}
                      disabled={!draftNote.trim() || addingNote}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground disabled:opacity-50"
                      aria-label="Save note"
                    >
                      <Send className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <ul className="max-h-72 space-y-2 overflow-auto pr-1">
                    {detail?.notes?.map((n: any) => (
                      <li
                        key={n.id}
                        className={`rounded-xl border p-3 text-sm ${
                          n.is_system
                            ? "border-rosewood/20 bg-accent/50 text-rosewood"
                            : "border-border bg-background"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{n.body}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{formatDate(n.created_at)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

function ComingSoonSection({
  icon: Icon,
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  icon: typeof Inbox;
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Section</p>
        <h1 className="mt-2 font-display text-3xl">{title}</h1>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-soft">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent">
          <Icon className="h-6 w-6 text-rosewood" strokeWidth={1.5} />
        </div>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{body}</p>
        {ctaHref && ctaLabel && (
          <Link
            to={ctaHref}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-rosewood/30 bg-card px-4 py-2 text-xs text-rosewood transition hover:bg-accent"
          >
            {ctaLabel} <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        )}
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Settings</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Access & invitations</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Public sign-up is disabled. Invite partners and staff by email, and
          approve role-elevation requests from existing partners.
        </p>
      </div>
      <InviteUserPanel />
      <RoleRequestsPanel />
    </div>
  );
}

function InviteUserPanel() {
  const inviteFn = useServerFn(inviteUser);
  const createEmpFn = useServerFn(createEmployeeAccount);
  const [mode, setMode] = useState<"invite" | "employee">("invite");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState<"partner" | "staff" | "admin">("partner");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState<string | null>(null);

  // When switching modes, normalize role
  useEffect(() => {
    if (mode === "employee" && role === "partner") setRole("staff");
    if (mode === "invite" && role !== "partner" && role !== "staff" && role !== "admin") {
      setRole("partner");
    }
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const mut = useMutation({
    mutationFn: async () => {
      if (mode === "employee") {
        return createEmpFn({
          data: {
            email,
            full_name: fullName,
            organization: organization || "LuxeNova Community Wellness, Inc.",
            role: role === "admin" ? "admin" : "staff",
          },
        });
      }
      return inviteFn({
        data: { email, full_name: fullName, organization, role },
      });
    },
    onSuccess: (r: any) => {
      setError(null);
      if (r?.temp_password) {
        setTempPassword(r.temp_password);
        setTempEmail(r.email);
        setInfo(null);
      } else {
        setInfo(`Invitation sent to ${r.email}.`);
        setTempPassword(null);
        setTempEmail(null);
      }
      setEmail("");
      setFullName("");
      setOrganization("");
    },
    onError: (e: any) => {
      setError(e?.message ?? "Could not complete request.");
      setInfo(null);
      setTempPassword(null);
    },
  });

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <UserPlus className="h-5 w-5 text-rosewood" strokeWidth={1.5} />
        <h2 className="font-display text-xl">Add a user</h2>
      </div>

      {/* Mode switch */}
      <div className="mt-4 inline-flex rounded-full border border-border bg-background p-1 text-xs">
        <button
          onClick={() => setMode("invite")}
          className={`rounded-full px-3 py-1.5 transition ${
            mode === "invite" ? "bg-rosewood text-rosewood-foreground" : "text-muted-foreground"
          }`}
        >
          Invite by email
        </button>
        <button
          onClick={() => setMode("employee")}
          className={`rounded-full px-3 py-1.5 transition ${
            mode === "employee" ? "bg-rosewood text-rosewood-foreground" : "text-muted-foreground"
          }`}
        >
          Create employee (temp password)
        </button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {mode === "invite"
          ? "Sends a secure invitation email. The user sets their own password before signing in."
          : "Creates the account immediately with a one-time temporary password. The employee will be forced to set a new password on first login."}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@organization.org"
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
        >
          {mode === "invite" && <option value="partner">Partner</option>}
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name (optional)"
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
        />
        <input
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder={
            mode === "employee"
              ? "LuxeNova Community Wellness, Inc."
              : "Organization (optional)"
          }
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
        />
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-rosewood/30 bg-accent/40 px-3 py-2 text-xs text-rosewood">
          {error}
        </p>
      )}
      {info && (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          {info}
        </p>
      )}
      {tempPassword && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
            One-time credentials — copy now, this won't be shown again
          </p>
          <div className="mt-3 grid gap-2 text-sm">
            <div>
              <span className="text-xs text-amber-900/70">Email</span>
              <code className="ml-2 rounded bg-white px-2 py-0.5 text-amber-900">{tempEmail}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-900/70">Temp password</span>
              <code className="rounded bg-white px-2 py-0.5 font-mono text-amber-900">
                {tempPassword}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `Email: ${tempEmail}\nTemporary password: ${tempPassword}\nSign in at: ${window.location.origin}/login`,
                  );
                }}
                className="rounded-full border border-amber-400 px-3 py-1 text-xs text-amber-900 hover:bg-amber-100"
              >
                Copy
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-amber-900/80">
            Share this securely (Signal, in person — not email). They'll be required
            to set a new password the first time they sign in.
          </p>
          <button
            onClick={() => {
              setTempPassword(null);
              setTempEmail(null);
            }}
            className="mt-3 text-xs text-amber-900 underline"
          >
            I've saved it — dismiss
          </button>
        </div>
      )}

      <button
        onClick={() => mut.mutate()}
        disabled={mut.isPending || !email}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-5 py-2 text-sm font-medium text-rosewood-foreground shadow-luxe disabled:opacity-50"
      >
        <Send className="h-4 w-4" strokeWidth={1.5} />
        {mut.isPending
          ? mode === "employee"
            ? "Creating…"
            : "Sending…"
          : mode === "employee"
            ? "Create employee account"
            : "Send invitation"}
      </button>
    </section>
  );
}

function RoleRequestsPanel() {
  const listFn = useServerFn(listRoleRequests);
  const decideFn = useServerFn(decideRoleRequest);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-role-requests"], queryFn: () => listFn() });

  const mut = useMutation({
    mutationFn: (vars: { id: string; decision: "approved" | "denied" }) =>
      decideFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-role-requests"] }),
  });

  const reqs = q.data ?? [];
  const pending = reqs.filter((r: any) => r.status === "pending");
  const past = reqs.filter((r: any) => r.status !== "pending").slice(0, 10);

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <HandHeart className="h-5 w-5 text-rosewood" strokeWidth={1.5} />
        <h2 className="font-display text-xl">Role-elevation requests</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Approve to grant the requested role immediately. Deny to leave the user
        at their current access level.
      </p>

      <div className="mt-5 space-y-3">
        {q.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!q.isLoading && pending.length === 0 && (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        )}
        {pending.map((r: any) => (
          <div key={r.id} className="rounded-xl border border-border/70 bg-background p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {r.profile?.full_name || "Unknown user"}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {r.profile?.organization || "—"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Requested role:{" "}
                  <span className="font-medium text-foreground">{r.requested_role}</span>
                  {" · "}
                  {new Date(r.created_at).toLocaleString()}
                </p>
                {r.message && (
                  <p className="mt-2 rounded-lg bg-accent/40 px-3 py-2 text-sm text-foreground/85">
                    {r.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => mut.mutate({ id: r.id, decision: "approved" })}
                  disabled={mut.isPending}
                  className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => mut.mutate({ id: r.id, decision: "denied" })}
                  disabled={mut.isPending}
                  className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium hover:border-foreground/30 disabled:opacity-50"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        ))}

        {past.length > 0 && (
          <div className="pt-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Recent decisions</p>
            <ul className="mt-2 divide-y divide-border/60 text-sm">
              {past.map((r: any) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span>
                    {r.profile?.full_name || "User"} — {r.requested_role}
                  </span>
                  <span className={r.status === "approved" ? "text-emerald-700" : "text-muted-foreground"}>
                    {r.status}
                    {r.decided_at ? ` · ${new Date(r.decided_at).toLocaleDateString()}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
