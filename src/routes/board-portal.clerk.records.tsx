import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/clerk/records")({
  head: () => ({ meta: [{ title: "Meeting Records — Clerk" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Records,
});

type Rec = { id: string; meeting_date: string; kind: string; quorum: boolean; notes: string | null };
const fields: FieldDef<Rec>[] = [
  { key: "meeting_date", label: "Meeting date", type: "date", required: true },
  { key: "kind", label: "Kind", type: "select", options: ["board", "committee", "annual", "special"] },
  { key: "quorum", label: "Quorum met?", type: "select", options: ["true", "false"] },
  { key: "notes", label: "Notes", type: "textarea" },
];

function Records() {
  return (
    <WorkspacePage title="Meeting Records" subtitle="Attendance, quorum, and outcomes for each meeting." eyebrow="Clerk · Workspace" backTo="/board-portal/clerk" backLabel="Back to Clerk hub">
      <SimpleCrud<Rec>
        table="meeting_records"
        fields={fields}
        orderBy="meeting_date"
        searchKeys={["kind", "notes"]}
        addLabel="New Record"
        emptyLabel="No meeting records yet."
        defaults={{ kind: "board", quorum: false, meeting_date: new Date().toISOString().slice(0, 10) }}
      />
    </WorkspacePage>
  );
}
