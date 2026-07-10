import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Download, Printer, Search, Trash2, Save, Mail, MessageSquare, Backpack, Package } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/back-to-school")({
  head: () => ({ meta: [{ title: "Back-to-School Registrations — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: BackToSchoolAdmin,
});

type Student = {
  id: string;
  registration_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  grade: string | null;
  school_name: string | null;
  backpack_needed: boolean;
  special_needs: string | null;
  shirt_size: string | null;
};

type Registration = {
  id: string;
  parent_first_name: string;
  parent_last_name: string;
  email: string | null;
  phone: string;
  preferred_contact: string;
  street_address: string;
  apartment: string | null;
  city: string | null;
  state: string;
  zip: string | null;
  adults_count: number | null;
  children_count: number | null;
  snap: boolean;
  wic: boolean;
  masshealth: boolean;
  housing_status: string | null;
  additional_info: string | null;
  status: string;
  internal_notes: string | null;
  created_at: string;
};

const STATUSES = ["pending", "approved", "waitlisted", "completed"] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  waitlisted: "bg-sky-100 text-sky-800",
  completed: "bg-muted text-foreground/70",
};

function BackToSchoolAdmin() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [zipFilter, setZipFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [detail, setDetail] = useState<Registration | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  async function load() {
    const [r, s] = await Promise.all([
      supabase.from("back_to_school_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("back_to_school_students").select("*"),
    ]);
    setRegs((r.data as Registration[]) ?? []);
    setStudents((s.data as Student[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  const studentsByReg = useMemo(() => {
    const m = new Map<string, Student[]>();
    for (const st of students) {
      const arr = m.get(st.registration_id) ?? [];
      arr.push(st);
      m.set(st.registration_id, arr);
    }
    return m;
  }, [students]);

  const filtered = regs.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (cityFilter && (r.city ?? "").toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (zipFilter && (r.zip ?? "") !== zipFilter) return false;
    if (!q) return true;
    const kids = (studentsByReg.get(r.id) ?? []).map((s) => `${s.first_name} ${s.last_name}`).join(" ");
    return `${r.parent_first_name} ${r.parent_last_name} ${kids}`.toLowerCase().includes(q.toLowerCase());
  });

  const cityOptions = Array.from(new Set(regs.map((r) => r.city).filter(Boolean) as string[])).sort();
  const zipOptions = Array.from(new Set(regs.map((r) => r.zip).filter(Boolean) as string[])).sort();

  // Supply totals across approved registrations
  const approvedIds = new Set(regs.filter((r) => r.status === "approved").map((r) => r.id));
  const approvedStudents = students.filter((s) => approvedIds.has(s.registration_id));
  const backpackCount = approvedStudents.filter((s) => s.backpack_needed).length;
  const supplyKitCount = approvedStudents.length;

  async function setStatus(id: string, status: string) {
    await supabase.from("back_to_school_registrations").update({ status }).eq("id", id);
    load();
  }
  async function saveNotes(id: string, notes: string) {
    await supabase.from("back_to_school_registrations").update({ internal_notes: notes }).eq("id", id);
    if (detail?.id === id) setDetail({ ...detail, internal_notes: notes });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this registration and its students?")) return;
    await supabase.from("back_to_school_registrations").delete().eq("id", id);
    load();
  }

  function exportRows() {
    const rows = filtered.flatMap((r) => {
      const kids = studentsByReg.get(r.id) ?? [];
      if (kids.length === 0) return [flat(r, null)];
      return kids.map((s) => flat(r, s));
    });
    exportCsv("back-to-school-registrations", rows);
  }

  function printOne(r: Registration) {
    const kids = studentsByReg.get(r.id) ?? [];
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(`
      <html><head><title>Registration — ${escape(r.parent_first_name)} ${escape(r.parent_last_name)}</title>
      <style>body{font-family:system-ui,sans-serif;padding:32px;color:#111;max-width:720px;margin:auto}
      h1{font-size:22px;margin:0 0 4px} h2{font-size:15px;margin:24px 0 8px;text-transform:uppercase;letter-spacing:.1em;color:#666}
      table{width:100%;border-collapse:collapse;font-size:13px} td{padding:6px 8px;border-bottom:1px solid #eee;vertical-align:top}
      td.label{width:180px;color:#666;text-transform:uppercase;font-size:11px;letter-spacing:.1em}
      .kid{border:1px solid #ddd;border-radius:8px;padding:12px;margin-top:8px}
      </style></head><body>
      <h1>Back-to-School Registration</h1>
      <p style="color:#666;font-size:12px">Submitted ${new Date(r.created_at).toLocaleString()}</p>
      <h2>Parent / Guardian</h2>
      <table>
        <tr><td class="label">Name</td><td>${escape(r.parent_first_name)} ${escape(r.parent_last_name)}</td></tr>
        <tr><td class="label">Phone</td><td>${escape(r.phone)}</td></tr>
        <tr><td class="label">Email</td><td>${escape(r.email ?? "—")}</td></tr>
        <tr><td class="label">Preferred Contact</td><td>${escape(r.preferred_contact)}</td></tr>
      </table>
      <h2>Address</h2>
      <table>
        <tr><td class="label">Street</td><td>${escape(r.street_address)}${r.apartment ? ", Apt " + escape(r.apartment) : ""}</td></tr>
        <tr><td class="label">City / State / ZIP</td><td>${escape(r.city ?? "")}, ${escape(r.state)} ${escape(r.zip ?? "")}</td></tr>
      </table>
      <h2>Household</h2>
      <table>
        <tr><td class="label">Adults / Children</td><td>${r.adults_count ?? 0} adults, ${r.children_count ?? 0} children</td></tr>
        <tr><td class="label">Benefits</td><td>${[r.snap && "SNAP", r.wic && "WIC", r.masshealth && "MassHealth"].filter(Boolean).join(", ") || "None"}</td></tr>
        <tr><td class="label">Housing Status</td><td>${escape(r.housing_status ?? "—")}</td></tr>
      </table>
      <h2>Students (${kids.length})</h2>
      ${kids.map((k) => `<div class="kid">
        <strong>${escape(k.first_name)} ${escape(k.last_name)}</strong>
        <div style="font-size:12px;color:#555;margin-top:4px">
          DOB: ${k.date_of_birth ?? "—"} · Grade: ${escape(k.grade ?? "—")} · School: ${escape(k.school_name ?? "—")}
          ${k.backpack_needed ? " · Backpack needed" : ""}${k.shirt_size ? " · Shirt: " + escape(k.shirt_size) : ""}
        </div>
        ${k.special_needs ? `<div style="font-size:12px;margin-top:6px">Notes: ${escape(k.special_needs)}</div>` : ""}
      </div>`).join("")}
      ${r.additional_info ? `<h2>Additional Info</h2><p style="font-size:13px">${escape(r.additional_info)}</p>` : ""}
      ${r.internal_notes ? `<h2>Internal Notes</h2><p style="font-size:13px">${escape(r.internal_notes)}</p>` : ""}
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 300);
  }

  return (
    <WorkspacePage
      title="Back-to-School Registrations"
      subtitle="Review family registrations, update status, and track supply needs."
      backTo="/board-portal/ed"
      backLabel="Back to ED hub"
      actions={
        <>
          <ActionButton icon={Download} label="Export CSV" onClick={exportRows} />
          <ActionButton icon={Printer} label="Print List" onClick={printCurrentView} />
        </>
      }
    >
      {/* Supply totals */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatTile icon={Backpack} label="Backpacks needed (approved)" value={backpackCount} />
        <StatTile icon={Package} label="Supply kits needed (approved)" value={supplyKitCount} />
        <StatTile label="Total registrations" value={regs.length} />
      </div>

      <DataCard>
        {/* Filters */}
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search parent or child…" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">All cities</option>
            {cityOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={zipFilter} onChange={(e) => setZipFilter(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">All ZIPs</option>
            {zipOptions.map((z) => <option key={z}>{z}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm capitalize">
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No registrations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="py-2">Parent</th>
                  <th>Contact</th>
                  <th>City / ZIP</th>
                  <th>Children</th>
                  <th>Backpacks</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const kids = studentsByReg.get(r.id) ?? [];
                  const packs = kids.filter((k) => k.backpack_needed).length;
                  return (
                    <tr key={r.id} className="border-t border-border/60 align-top">
                      <td className="py-3 pr-3">
                        <button onClick={() => { setDetail(r); setNotesDraft(r.internal_notes ?? ""); }} className="text-left font-medium hover:underline">
                          {r.parent_first_name} {r.parent_last_name}
                        </button>
                      </td>
                      <td className="pr-3">
                        <div>{r.phone}</div>
                        <div className="text-xs text-muted-foreground">{r.email ?? "—"}</div>
                      </td>
                      <td className="pr-3">{r.city ?? "—"}{r.zip ? ` · ${r.zip}` : ""}</td>
                      <td className="pr-3">{kids.length}</td>
                      <td className="pr-3">{packs}</td>
                      <td className="pr-3">
                        <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}
                          className={`rounded-full border border-transparent px-2.5 py-1 text-xs capitalize ${STATUS_COLORS[r.status] ?? ""}`}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="pr-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {r.email && (
                            <a href={`mailto:${r.email}`} aria-label="Email family" className="text-muted-foreground hover:text-rosewood"><Mail className="h-4 w-4" /></a>
                          )}
                          {r.phone && (
                            <a href={`sms:${r.phone.replace(/[^\d+]/g, "")}`} aria-label="Text family" className="text-muted-foreground hover:text-rosewood"><MessageSquare className="h-4 w-4" /></a>
                          )}
                          <button onClick={() => printOne(r)} aria-label="Print registration" className="text-muted-foreground hover:text-foreground"><Printer className="h-4 w-4" /></button>
                          <button onClick={() => remove(r.id)} aria-label="Delete" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-luxe">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">{detail.parent_first_name} {detail.parent_last_name}</h2>
                <p className="text-sm text-muted-foreground">Submitted {new Date(detail.created_at).toLocaleString()}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs capitalize ${STATUS_COLORS[detail.status] ?? ""}`}>{detail.status}</span>
            </div>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Phone" value={detail.phone} />
              <Info label="Email" value={detail.email ?? "—"} />
              <Info label="Preferred contact" value={detail.preferred_contact} />
              <Info label="Address" value={`${detail.street_address}${detail.apartment ? ", Apt " + detail.apartment : ""}, ${detail.city ?? ""} ${detail.state} ${detail.zip ?? ""}`} />
              <Info label="Household" value={`${detail.adults_count ?? 0} adults · ${detail.children_count ?? 0} children`} />
              <Info label="Housing" value={detail.housing_status ?? "—"} />
              <Info label="Benefits" value={[detail.snap && "SNAP", detail.wic && "WIC", detail.masshealth && "MassHealth"].filter(Boolean).join(", ") || "None"} />
            </div>

            {detail.additional_info && (
              <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Additional info</p>
                <p className="mt-1 whitespace-pre-wrap">{detail.additional_info}</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-display text-lg">Students</h3>
              <ul className="mt-2 space-y-2">
                {(studentsByReg.get(detail.id) ?? []).map((k) => (
                  <li key={k.id} className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong>{k.first_name} {k.last_name}</strong>
                      <span className="text-xs text-muted-foreground">Grade {k.grade ?? "?"} · {k.school_name ?? "school not listed"}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      DOB {k.date_of_birth ?? "—"}
                      {k.backpack_needed && " · 🎒 Backpack needed"}
                      {k.shirt_size && ` · Shirt: ${k.shirt_size}`}
                    </div>
                    {k.special_needs && <p className="mt-1 text-sm">{k.special_needs}</p>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Internal notes</label>
              <textarea rows={4} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {detail.email && <ActionButton icon={Mail} label="Email family" onClick={() => window.open(`mailto:${detail.email}`)} />}
              {detail.phone && <ActionButton icon={MessageSquare} label="Text family" onClick={() => window.open(`sms:${detail.phone.replace(/[^\d+]/g, "")}`)} />}
              <ActionButton icon={Printer} label="Print" onClick={() => printOne(detail)} />
              <ActionButton icon={Save} label="Save notes" variant="primary" onClick={() => saveNotes(detail.id, notesDraft)} />
              <ActionButton label="Close" onClick={() => setDetail(null)} />
            </div>
          </div>
        </div>
      )}
    </WorkspacePage>
  );
}

function StatTile({ icon: Icon, label, value }: { icon?: typeof Backpack; label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        {Icon && <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood"><Icon className="h-5 w-5" strokeWidth={1.5} /></span>}
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          <p className="font-display text-2xl">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function flat(r: Registration, s: Student | null) {
  return {
    submitted_at: r.created_at,
    status: r.status,
    parent_first_name: r.parent_first_name,
    parent_last_name: r.parent_last_name,
    phone: r.phone,
    email: r.email ?? "",
    preferred_contact: r.preferred_contact,
    street: r.street_address,
    apartment: r.apartment ?? "",
    city: r.city ?? "",
    state: r.state,
    zip: r.zip ?? "",
    adults: r.adults_count ?? "",
    children: r.children_count ?? "",
    snap: r.snap ? "Yes" : "No",
    wic: r.wic ? "Yes" : "No",
    masshealth: r.masshealth ? "Yes" : "No",
    housing_status: r.housing_status ?? "",
    child_first_name: s?.first_name ?? "",
    child_last_name: s?.last_name ?? "",
    child_dob: s?.date_of_birth ?? "",
    grade: s?.grade ?? "",
    school: s?.school_name ?? "",
    backpack_needed: s?.backpack_needed ? "Yes" : "No",
    shirt_size: s?.shirt_size ?? "",
    special_needs: s?.special_needs ?? "",
    additional_info: r.additional_info ?? "",
    internal_notes: r.internal_notes ?? "",
  };
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
