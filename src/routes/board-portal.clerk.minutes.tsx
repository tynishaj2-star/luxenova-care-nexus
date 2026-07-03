import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/clerk/minutes")({
  head: () => ({ meta: [{ title: "Board Minutes — Clerk" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Minutes,
});

type Minutes = { id: string; meeting_date: string; title: string; body: string | null; status: string; approved_at: string | null };
const fields: FieldDef<Minutes>[] = [
  { key: "meeting_date", label: "Meeting date", type: "date", required: true },
  { key: "title", label: "Title", required: true },
  { key: "status", label: "Status", type: "select", options: ["draft", "approved"] },
  { key: "body", label: "Minutes body", type: "textarea" },
];

function Minutes() {
  return (
    <WorkspacePage title="Board Minutes" subtitle="Draft, edit, and approve board meeting minutes." eyebrow="Clerk · Workspace" backTo="/board-portal/clerk" backLabel="Back to Clerk hub">
      <SimpleCrud<Minutes>
        table="board_minutes"
        fields={fields}
        orderBy="meeting_date"
        searchKeys={["title", "body"]}
        addLabel="New Minutes"
        emptyLabel="No minutes recorded yet."
        defaults={{ status: "draft", meeting_date: new Date().toISOString().slice(0, 10) }}
      />
    </WorkspacePage>
  );
}
