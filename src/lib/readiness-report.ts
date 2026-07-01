// Onboarding readiness report generation (CSV + PDF).
// Generated client-side from PermissionsSection using the live probe results.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { JOB_ROLE_LABEL, type JobRole } from "./staff-roles";
import { ORG } from "./org";

export type ReadinessReportRow = {
  role: JobRole;
  workspace: string;
  homePath: string;
  itemId: string;
  itemLabel: string;
  kind: "route" | "table_read" | "static";
  target: string; // route path or table name
  status: "Pass" | "Fail" | "Manual";
  reason: string;
};

function stamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${mi}`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function downloadReadinessCsv(rows: ReadinessReportRow[]) {
  const header = ["Role", "Workspace", "Home Path", "Item", "Kind", "Target", "Status", "Reason"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        JOB_ROLE_LABEL[r.role],
        r.workspace,
        r.homePath,
        r.itemLabel,
        r.kind,
        r.target,
        r.status,
        r.reason,
      ]
        .map((v) => csvEscape(String(v ?? "")))
        .join(","),
    );
  }
  triggerDownload(
    new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }),
    `onboarding-readiness-${stamp()}.csv`,
  );
}

export function downloadReadinessPdf(rows: ReadinessReportRow[]) {
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "landscape" });
  const now = new Date().toLocaleString();

  doc.setFontSize(16);
  doc.text(`${ORG.name} — Onboarding Readiness Report`, 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(`Generated ${now}`, 40, 58);
  doc.setTextColor(0);

  // Summary by role
  const byRole = new Map<JobRole, { pass: number; fail: number; total: number }>();
  for (const r of rows) {
    const bucket = byRole.get(r.role) ?? { pass: 0, fail: 0, total: 0 };
    bucket.total++;
    if (r.status === "Pass") bucket.pass++;
    else if (r.status === "Fail") bucket.fail++;
    byRole.set(r.role, bucket);
  }
  const summaryBody = Array.from(byRole.entries()).map(([role, s]) => [
    JOB_ROLE_LABEL[role],
    `${s.pass} / ${s.total}`,
    String(s.fail),
    s.fail === 0 ? "Ready" : "Action needed",
  ]);
  autoTable(doc, {
    startY: 74,
    head: [["Workspace", "Passing", "Failing", "Status"]],
    body: summaryBody,
    theme: "striped",
    headStyles: { fillColor: [125, 62, 62] },
    styles: { fontSize: 10 },
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [["Workspace", "Item", "Kind", "Target", "Status", "Reason"]],
    body: rows.map((r) => [
      JOB_ROLE_LABEL[r.role],
      r.itemLabel,
      r.kind,
      r.target,
      r.status,
      r.reason,
    ]),
    theme: "grid",
    headStyles: { fillColor: [125, 62, 62] },
    styles: { fontSize: 9, cellPadding: 4 },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const v = data.cell.raw as string;
        if (v === "Fail") data.cell.styles.textColor = [178, 34, 52];
        else if (v === "Pass") data.cell.styles.textColor = [21, 128, 61];
      }
    },
  });

  doc.save(`onboarding-readiness-${stamp()}.pdf`);
}
