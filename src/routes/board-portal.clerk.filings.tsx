import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/clerk/filings")({
  head: () => ({ meta: [{ title: "Filing Tracker — Clerk" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Filings,
});

type Filing = { id: string; name: string; jurisdiction: string | null; due_at: string | null; filed_at: string | null; status: string; notes: string | null };
const fields: FieldDef<Filing>[] = [
  { key: "name", label: "Filing name", required: true },
  { key: "jurisdiction", label: "Jurisdiction", placeholder: "IRS, MA Secretary of State, etc." },
  { key: "due_at", label: "Due date", type: "date" },
  { key: "filed_at", label: "Filed date", type: "date" },
  { key: "status", label: "Status", type: "select", options: ["pending", "in-progress", "filed", "overdue"] },
  { key: "notes", label: "Notes", type: "textarea" },
];

function Filings() {
  return (
    <WorkspacePage title="Filing Tracker" subtitle="State and federal filing due dates." eyebrow="Clerk · Workspace" backTo="/board-portal/clerk" backLabel="Back to Clerk hub">
      <SimpleCrud<Filing>
        table="filings"
        fields={fields}
        orderBy="due_at"
        ascending
        searchKeys={["name", "jurisdiction", "notes"]}
        addLabel="New Filing"
        emptyLabel="No filings tracked yet."
        defaults={{ status: "pending" }}
      />
    </WorkspacePage>
  );
}
