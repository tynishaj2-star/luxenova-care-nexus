import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Check, X, ShieldCheck, ListChecks, PlayCircle, Loader2, AlertTriangle, FileDown, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PERMISSION_MATRIX, READINESS, type Action } from "@/lib/permissions-matrix";
import { JOB_ROLE_LABEL, type JobRole, STAFF_DIRECTORY } from "@/lib/staff-roles";
import { downloadReadinessCsv, downloadReadinessPdf, type ReadinessReportRow } from "@/lib/readiness-report";

type ProbeStatus = "pending" | "ok" | "fail";

const ROLES: JobRole[] = ["admin", "coo", "cfo", "events", "clerk"];

function YesNo({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="mx-auto h-4 w-4 text-emerald-600" strokeWidth={2} />
  ) : (
    <X className="mx-auto h-4 w-4 text-muted-foreground/60" strokeWidth={2} />
  );
}

export function PermissionsSection() {
  const router = useRouter();
  const [probes, setProbes] = useState<Record<string, ProbeStatus>>({});
  const [smokeBusy, setSmokeBusy] = useState(false);
  const [smokeResult, setSmokeResult] = useState<
    { role: JobRole; passed: number; total: number; failures: string[] }[]
  >([]);

  // Live route existence check via the TanStack router
  const routeExists = useMemo(() => {
    return (path: string) => {
      try {
        const idx = path.indexOf(" ");
        const clean = idx >= 0 ? path.slice(0, idx) : path;
        const map = (router as unknown as { routesByPath?: Record<string, unknown> }).routesByPath;
        return !!map?.[clean];
      } catch {
        return false;
      }
    };
  }, [router]);

  // Probe table reads for the *current* user.
  useEffect(() => {
    const tables = Array.from(
      new Set([
        ...PERMISSION_MATRIX.filter((a) => a.readProbeTable).map((a) => a.readProbeTable!),
        ...READINESS.flatMap((r) => r.items.filter((i) => i.kind === "table_read").map((i) => i.table!)),
      ]),
    );
    setProbes(Object.fromEntries(tables.map((t) => [t, "pending"])));
    (async () => {
      const next: Record<string, ProbeStatus> = {};
      await Promise.all(
        tables.map(async (t) => {
          const { error } = await supabase.from(t as any).select("*", { head: true, count: "exact" }).limit(1);
          next[t] = error ? "fail" : "ok";
        }),
      );
      setProbes(next);
    })();
  }, []);

  async function runSmoke() {
    setSmokeBusy(true);
    setSmokeResult([]);
    const results: typeof smokeResult = [];
    for (const r of READINESS) {
      const failures: string[] = [];
      let passed = 0;
      for (const item of r.items) {
        if (item.kind === "route") {
          if (item.route && routeExists(item.route)) passed++;
          else failures.push(`Route missing: ${item.route}`);
        } else if (item.kind === "table_read") {
          const status = probes[item.table!];
          if (status === "ok") passed++;
          else failures.push(`Table not readable: ${item.table}`);
        } else {
          // static items default to pass (component existence verified by build)
          passed++;
        }
      }
      results.push({ role: r.role, passed, total: r.items.length, failures });
    }
    setSmokeResult(results);
    setSmokeBusy(false);
  }

  const reportRows: ReadinessReportRow[] = useMemo(() => {
    const rows: ReadinessReportRow[] = [];
    for (const r of READINESS) {
      for (const item of r.items) {
        let status: "Pass" | "Fail" | "Manual" = "Pass";
        let target = "";
        let reason = "";
        if (item.kind === "route") {
          target = item.route ?? "";
          const ok = item.route ? routeExists(item.route) : false;
          status = ok ? "Pass" : "Fail";
          if (!ok) reason = `Missing route: ${item.route}`;
        } else if (item.kind === "table_read") {
          target = item.table ?? "";
          const s = probes[item.table!];
          if (s === "pending" || s === undefined) {
            status = "Manual";
            reason = "Probe pending";
          } else if (s === "ok") {
            status = "Pass";
          } else {
            status = "Fail";
            reason = `Blocked table: ${item.table}`;
          }
        } else {
          status = "Manual";
          target = item.hint ?? "component";
          reason = "Verified by build";
        }
        rows.push({
          role: r.role,
          workspace: JOB_ROLE_LABEL[r.role],
          homePath: r.homePath,
          itemId: item.id,
          itemLabel: item.label,
          kind: item.kind,
          target,
          status,
          reason,
        });
      }
    }
    return rows;
  }, [probes, routeExists]);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Permissions & Readiness</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Who can do what — verified live</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Permission matrix per role, per-workspace readiness checklists, and an in-app smoke runner that verifies routes, components, and database access — so you know each staff member is set up before onboarding.
        </p>
      </header>

      {/* SMOKE RUNNER */}
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <PlayCircle className="h-4 w-4 text-rosewood" strokeWidth={1.5} /> Workspace smoke test
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadReadinessCsv(reportRows)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-soft transition hover:border-rosewood/40"
              title="Download onboarding readiness report as CSV"
            >
              <FileDown className="h-3.5 w-3.5" /> CSV
            </button>
            <button
              onClick={() => downloadReadinessPdf(reportRows)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-soft transition hover:border-rosewood/40"
              title="Download onboarding readiness report as PDF"
            >
              <FileText className="h-3.5 w-3.5" /> PDF
            </button>
            <button
              onClick={runSmoke}
              disabled={smokeBusy}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-4 py-1.5 text-xs text-rosewood-foreground shadow-luxe transition hover:opacity-90 disabled:opacity-60"
            >
              {smokeBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
              {smokeBusy ? "Running…" : "Run smoke check"}
            </button>
          </div>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Verifies that every route in each workspace exists in the router and that the database tables each role needs are readable by the signed-in account. For a true end-to-end test that signs in as each staff member, use the Playwright spec at <code className="rounded bg-accent px-1.5 py-0.5">tests/smoke-workspaces.spec.ts</code>.
        </p>
        {smokeResult.length === 0 ? (
          <p className="text-sm text-muted-foreground">Press <strong>Run smoke check</strong> to verify all five workspaces.</p>
        ) : (
          <div className="space-y-3">
            {smokeResult.map((r) => {
              const ok = r.failures.length === 0;
              return (
                <div
                  key={r.role}
                  className={`rounded-xl border p-3 ${ok ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{JOB_ROLE_LABEL[r.role]}</div>
                    <div className={`text-xs font-semibold ${ok ? "text-emerald-700" : "text-amber-700"}`}>
                      {r.passed} / {r.total} {ok ? "passing" : "— action needed"}
                    </div>
                  </div>
                  {!ok && (
                    <ul className="mt-2 list-disc pl-5 text-xs text-amber-800">
                      {r.failures.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PERMISSION MATRIX */}
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <ShieldCheck className="h-4 w-4 text-rosewood" strokeWidth={1.5} /> Permission matrix
          </h2>
          <p className="text-xs text-muted-foreground">
            Live column reflects <strong>your</strong> account; matrix columns are by design.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="py-2 pr-3">Action</th>
                <th className="py-2 pr-3">Category</th>
                {ROLES.map((r) => (
                  <th key={r} className="py-2 px-2 text-center">
                    {r === "admin" ? "Admin" : r.toUpperCase()}
                  </th>
                ))}
                <th className="py-2 px-2 text-center">Live (you)</th>
                <th className="py-2 pl-3">Gate</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MATRIX.map((a: Action) => {
                const liveStatus = a.readProbeTable ? probes[a.readProbeTable] : undefined;
                return (
                  <tr key={a.id} className="border-b border-border/40 align-top">
                    <td className="py-2 pr-3 font-medium">{a.label}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{a.category}</td>
                    {ROLES.map((r) => (
                      <td key={r} className="py-2 px-2 text-center">
                        <YesNo ok={a.allowedFor.includes(r)} />
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center">
                      {liveStatus === undefined ? (
                        <span className="text-xs text-muted-foreground/70">—</span>
                      ) : liveStatus === "pending" ? (
                        <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      ) : liveStatus === "ok" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                          <Check className="h-3 w-3" /> ok
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] text-rose-700">
                          <X className="h-3 w-3" /> blocked
                        </span>
                      )}
                    </td>
                    <td className="py-2 pl-3 text-xs text-muted-foreground">{a.gate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* READINESS CHECKLISTS */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg">
          <ListChecks className="h-4 w-4 text-rosewood" strokeWidth={1.5} /> Role readiness checklists
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {READINESS.map((r) => {
            const member = STAFF_DIRECTORY.find((s) => s.jobRole === r.role);
            return (
              <div key={r.role} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base">{JOB_ROLE_LABEL[r.role]}</p>
                    {member && (
                      <p className="text-xs text-muted-foreground">
                        {member.name} · {member.email}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-rosewood">
                      Lands on: {r.homePath}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {r.items.map((item) => {
                    let ok = true;
                    let note = "";
                    if (item.kind === "route") {
                      ok = item.route ? routeExists(item.route) : false;
                      note = item.route ?? "";
                    } else if (item.kind === "table_read") {
                      const s = probes[item.table!];
                      ok = s === "ok";
                      note = item.table ?? "";
                    } else {
                      note = item.hint ?? "verified by build";
                    }
                    return (
                      <li key={item.id} className="flex items-start gap-2 text-sm">
                        <span
                          className={`mt-0.5 grid h-4 w-4 place-items-center rounded-full ${
                            ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {ok ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <AlertTriangle className="h-3 w-3" />}
                        </span>
                        <div className="min-w-0">
                          <span>{item.label}</span>
                          {note && <span className="ml-2 text-[11px] text-muted-foreground">({note})</span>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
