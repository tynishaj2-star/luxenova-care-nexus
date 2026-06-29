import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  DollarSign,
  Download,
  Printer,
  Filter,
  Plus,
  Megaphone,
  UserPlus,
  Users,
  CalendarPlus,
  Mail,
  ClipboardCheck,
  ShieldCheck,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AuditLog = {
  id: string;
  occurred_at: string;
  actor_id: string | null;
  actor_email: string | null;
  event_type: string;
  entity_type: string | null;
  entity_id: string | null;
  action: string;
  summary: string | null;
  metadata: Record<string, unknown>;
};

type Donation = {
  id: string;
  created_at: string;
  donor_name: string;
  donor_email: string | null;
  amount_cents: number;
  currency: string;
  source: string;
  designation: string | null;
  notes: string | null;
};

type Alert = {
  id: string;
  created_at: string;
  severity: "info" | "warning" | "critical";
  title: string;
  body: string | null;
  is_active: boolean;
  resolved_at: string | null;
};

const EVENT_TYPES = [
  { value: "all", label: "All events" },
  { value: "user_action", label: "User actions" },
  { value: "referral_status_change", label: "Referral status changes" },
  { value: "document_upload", label: "Document uploads" },
  { value: "login", label: "Logins" },
  { value: "invite", label: "Invitations" },
] as const;

const SEVERITY_TONE: Record<Alert["severity"], string> = {
  info: "bg-sky-50 text-sky-800 border-sky-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  critical: "bg-rose-50 text-rose-800 border-rose-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

function downloadCSV(rows: AuditLog[]) {
  const headers = ["Occurred At", "Actor", "Event Type", "Action", "Entity", "Summary"];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = rows.map((r) =>
    [
      r.occurred_at,
      r.actor_email ?? r.actor_id ?? "system",
      r.event_type,
      r.action,
      [r.entity_type, r.entity_id].filter(Boolean).join(":"),
      r.summary ?? "",
    ]
      .map(escape)
      .join(","),
  );
  const csv = [headers.join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function printPDF(rows: AuditLog[]) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  const html = `<!doctype html><html><head><title>Audit Log — LuxeNova Community Wellness, Inc.</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,sans-serif;padding:32px;color:#1f1410;}
    h1{font-size:20px;margin:0 0 4px;} .sub{color:#7a6b65;font-size:12px;margin-bottom:24px;}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #eee;vertical-align:top;}
    th{background:#faf6f3;text-transform:uppercase;font-size:10px;letter-spacing:.08em;}
  </style></head><body>
  <h1>Audit Log — LuxeNova Community Wellness, Inc.</h1>
  <div class="sub">Generated ${new Date().toLocaleString()} · ${rows.length} entries</div>
  <table><thead><tr>
    <th>When</th><th>Actor</th><th>Event</th><th>Action</th><th>Entity</th><th>Summary</th>
  </tr></thead><tbody>
  ${rows
    .map(
      (r) => `<tr>
      <td>${new Date(r.occurred_at).toLocaleString()}</td>
      <td>${r.actor_email ?? r.actor_id ?? "system"}</td>
      <td>${r.event_type}</td>
      <td>${r.action}</td>
      <td>${[r.entity_type, r.entity_id].filter(Boolean).join(":")}</td>
      <td>${(r.summary ?? "").replace(/</g, "&lt;")}</td>
    </tr>`,
    )
    .join("")}
  </tbody></table>
  <script>window.onload=()=>{window.print();}</script>
  </body></html>`;
  win.document.write(html);
  win.document.close();
}

export function OperationsSection() {
  const qc = useQueryClient();

  // ---------- Audit Logs ----------
  const [eventType, setEventType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [actorQuery, setActorQuery] = useState("");

  const logsQ = useQuery({
    queryKey: ["audit_logs", eventType, startDate, endDate],
    queryFn: async (): Promise<AuditLog[]> => {
      let q = supabase
        .from("audit_logs")
        .select("*")
        .order("occurred_at", { ascending: false })
        .limit(500);
      if (eventType !== "all") q = q.eq("event_type", eventType);
      if (startDate) q = q.gte("occurred_at", new Date(startDate).toISOString());
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        q = q.lte("occurred_at", end.toISOString());
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as AuditLog[];
    },
  });

  const filteredLogs = useMemo(() => {
    const rows = logsQ.data ?? [];
    if (!actorQuery.trim()) return rows;
    const q = actorQuery.toLowerCase();
    return rows.filter(
      (r) =>
        (r.actor_email ?? "").toLowerCase().includes(q) ||
        (r.summary ?? "").toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q),
    );
  }, [logsQ.data, actorQuery]);

  // ---------- Donations ----------
  const donationsQ = useQuery({
    queryKey: ["donations"],
    queryFn: async (): Promise<Donation[]> => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return (data ?? []) as Donation[];
    },
  });

  const [showDonation, setShowDonation] = useState(false);

  // ---------- Alerts ----------
  const alertsQ = useQuery({
    queryKey: ["emergency_alerts"],
    queryFn: async (): Promise<Alert[]> => {
      const { data, error } = await supabase
        .from("emergency_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as Alert[];
    },
  });

  const resolveAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("emergency_alerts")
        .update({ is_active: false, resolved_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergency_alerts"] }),
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const activeAlerts = (alertsQ.data ?? []).filter((a) => a.is_active);
  const totalRecent = (donationsQ.data ?? []).reduce((sum, d) => sum + d.amount_cents, 0);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Operations Center</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Audit, alerts & quick actions</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Audit every user action, monitor live emergency alerts, log donations, and trigger the most common admin tasks from one place.
        </p>
      </header>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg">
          <ShieldCheck className="h-4 w-4 text-rosewood" strokeWidth={1.5} /> Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction icon={UserPlus} label="Add Volunteer" href="/careers" />
          <QuickAction icon={Users} label="Add Client" href="/referrals" />
          <QuickAction icon={CalendarPlus} label="Create Event" href="/food-drives" />
          <QuickAction icon={Mail} label="Send Email" href="/contact" />
          <QuickAction icon={ClipboardCheck} label="Create Board Meeting" href="/board-portal" />
          <QuickAction icon={ShieldCheck} label="Approve Application" onClick={() => alert("Open Requests → filter 'New' to approve incoming applications.")} />
          <QuickAction icon={Megaphone} label="Post Announcement" onClick={() => setShowAnnouncement(true)} />
          <QuickAction icon={AlertTriangle} label="Raise Emergency Alert" onClick={() => setShowAlert(true)} />
        </div>
      </section>

      {/* EMERGENCY ALERTS + RECENT DONATIONS */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <AlertTriangle className="h-4 w-4 text-rosewood" strokeWidth={1.5} /> Emergency Alerts
            </h2>
            <button
              onClick={() => setShowAlert(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-rosewood px-3 py-1.5 text-xs text-rosewood-foreground shadow-luxe transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> New alert
            </button>
          </div>
          {alertsQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading alerts…</p>
          ) : activeAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active alerts. All clear.</p>
          ) : (
            <ul className="space-y-3">
              {activeAlerts.map((a) => (
                <li key={a.id} className={`rounded-xl border px-4 py-3 ${SEVERITY_TONE[a.severity]}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{a.title}</p>
                      {a.body && <p className="mt-0.5 text-xs opacity-80">{a.body}</p>}
                      <p className="mt-1 text-[10px] uppercase tracking-wider opacity-70">
                        {a.severity} · {formatDate(a.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => resolveAlert.mutate(a.id)}
                      className="rounded-full bg-white/60 p-1 transition hover:bg-white"
                      title="Resolve"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <DollarSign className="h-4 w-4 text-rosewood" strokeWidth={1.5} /> Recent Donations
            </h2>
            <button
              onClick={() => setShowDonation(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-rosewood px-3 py-1.5 text-xs text-rosewood-foreground shadow-luxe transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Log donation
            </button>
          </div>
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Last 25 · Total {formatMoney(totalRecent)}
          </p>
          {donationsQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading donations…</p>
          ) : (donationsQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No donations logged yet. Click <span className="font-medium">Log donation</span> or sync via Givebutter.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {(donationsQ.data ?? []).map((d) => (
                <li key={d.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium">{d.donor_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.source} · {d.designation ?? "General"} · {formatDate(d.created_at)}
                    </p>
                  </div>
                  <span className="font-display text-base text-rosewood">
                    {formatMoney(d.amount_cents, d.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* AUDIT LOG */}
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <Activity className="h-4 w-4 text-rosewood" strokeWidth={1.5} /> Audit Log
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCSV(filteredLogs)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs transition hover:border-rosewood/40"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} /> Export CSV
            </button>
            <button
              onClick={() => printPDF(filteredLogs)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs transition hover:border-rosewood/40"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={1.5} /> Export PDF
            </button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Event type</span>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Search actor / summary</span>
            <input
              type="search"
              value={actorQuery}
              onChange={(e) => setActorQuery(e.target.value)}
              placeholder="email, action, keyword…"
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="py-2 pr-3">When</th>
                <th className="py-2 pr-3">Actor</th>
                <th className="py-2 pr-3">Event</th>
                <th className="py-2 pr-3">Action</th>
                <th className="py-2 pr-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {logsQ.isLoading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Loading audit entries…
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No audit entries match these filters yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((r) => (
                  <tr key={r.id} className="border-b border-border/40 align-top">
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{formatDate(r.occurred_at)}</td>
                    <td className="py-2 pr-3 text-xs">{r.actor_email ?? r.actor_id ?? "system"}</td>
                    <td className="py-2 pr-3">
                      <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider">
                        {r.event_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-xs font-medium">{r.action}</td>
                    <td className="py-2 pr-3 text-xs text-foreground/80">{r.summary}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Showing {filteredLogs.length} entries (most recent 500). Referral status changes are recorded automatically.
        </p>
      </section>

      {/* MODALS */}
      {showDonation && <DonationModal onClose={() => setShowDonation(false)} />}
      {showAlert && <AlertModal onClose={() => setShowAlert(false)} />}
      {showAnnouncement && <AnnouncementModal onClose={() => setShowAnnouncement(false)} />}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: typeof Activity;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const cls =
    "flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left shadow-soft transition hover:border-rosewood/40 hover:shadow-luxe";
  const inner = (
    <>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-rosewood">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </>
  );
  if (href) {
    return (
      <Link to={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-luxe">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-accent" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DonationModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [donor, setDonor] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Manual");
  const [designation, setDesignation] = useState("General");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!donor || !amount) return;
    setSaving(true);
    const cents = Math.round(parseFloat(amount) * 100);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("donations").insert({
      donor_name: donor,
      donor_email: email || null,
      amount_cents: cents,
      source,
      designation,
      notes: notes || null,
      recorded_by: u.user?.id ?? null,
    });
    if (!error) {
      await supabase.from("audit_logs").insert({
        actor_id: u.user?.id ?? null,
        actor_email: u.user?.email ?? null,
        event_type: "user_action",
        entity_type: "donation",
        action: "donation_logged",
        summary: `Logged donation from ${donor} — $${amount} (${source})`,
      });
      qc.invalidateQueries({ queryKey: ["donations"] });
      qc.invalidateQueries({ queryKey: ["audit_logs"] });
      onClose();
    } else {
      alert(error.message);
    }
    setSaving(false);
  }

  return (
    <Modal title="Log donation" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Input label="Donor name *" value={donor} onChange={setDonor} />
        <Input label="Donor email" value={email} onChange={setEmail} type="email" />
        <Input label="Amount (USD) *" value={amount} onChange={setAmount} type="number" />
        <Input label="Source" value={source} onChange={setSource} placeholder="Givebutter, Cash, Check…" />
        <Input label="Designation" value={designation} onChange={setDesignation} placeholder="General, Chauntae's Voice…" />
        <Input label="Notes" value={notes} onChange={setNotes} />
        <button
          onClick={save}
          disabled={saving}
          className="w-full rounded-full bg-gradient-rosewood py-2 text-sm text-rosewood-foreground shadow-luxe transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save donation"}
        </button>
      </div>
    </Modal>
  );
}

function AlertModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [severity, setSeverity] = useState<Alert["severity"]>("info");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("emergency_alerts")
      .insert({ title, body: body || null, severity, created_by: u.user?.id ?? null });
    if (!error) {
      await supabase.from("audit_logs").insert({
        actor_id: u.user?.id ?? null,
        actor_email: u.user?.email ?? null,
        event_type: "user_action",
        entity_type: "emergency_alert",
        action: "alert_raised",
        summary: `${severity.toUpperCase()} alert: ${title}`,
      });
      qc.invalidateQueries({ queryKey: ["emergency_alerts"] });
      qc.invalidateQueries({ queryKey: ["audit_logs"] });
      onClose();
    } else {
      alert(error.message);
    }
    setSaving(false);
  }

  return (
    <Modal title="Raise emergency alert" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Severity</span>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Alert["severity"])}
            className="rounded-lg border border-border bg-background px-2 py-1.5"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </label>
        <Input label="Title *" value={title} onChange={setTitle} />
        <Input label="Details" value={body} onChange={setBody} />
        <button
          onClick={save}
          disabled={saving}
          className="w-full rounded-full bg-gradient-rosewood py-2 text-sm text-rosewood-foreground shadow-luxe transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Posting…" : "Post alert"}
        </button>
      </div>
    </Modal>
  );
}

function AnnouncementModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("internal");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("announcements")
      .insert({ title, body: body || null, audience, created_by: u.user?.id ?? null });
    if (!error) {
      await supabase.from("audit_logs").insert({
        actor_id: u.user?.id ?? null,
        actor_email: u.user?.email ?? null,
        event_type: "user_action",
        entity_type: "announcement",
        action: "announcement_posted",
        summary: `Announcement posted to ${audience}: ${title}`,
      });
      qc.invalidateQueries({ queryKey: ["audit_logs"] });
      onClose();
    } else {
      alert(error.message);
    }
    setSaving(false);
  }

  return (
    <Modal title="Post announcement" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Audience</span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1.5"
          >
            <option value="internal">Internal (staff only)</option>
            <option value="partners">Partners</option>
            <option value="public">Public</option>
          </select>
        </label>
        <Input label="Title *" value={title} onChange={setTitle} />
        <Input label="Body" value={body} onChange={setBody} />
        <button
          onClick={save}
          disabled={saving}
          className="w-full rounded-full bg-gradient-rosewood py-2 text-sm text-rosewood-foreground shadow-luxe transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Posting…" : "Post announcement"}
        </button>
      </div>
    </Modal>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-2 py-1.5"
      />
    </label>
  );
}
