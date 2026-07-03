import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/coo/gaps")({
  head: () => ({ meta: [{ title: "Resource Gaps — Programs" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Gaps,
});

type Gap = { id: string; title: string; description: string | null; priority: string; status: string };
const fields: FieldDef<Gap>[] = [
  { key: "title", label: "Gap title", required: true },
  { key: "priority", label: "Priority", type: "select", options: ["low", "normal", "high", "urgent"] },
  { key: "status", label: "Status", type: "select", options: ["open", "in-progress", "resolved", "deferred"] },
  { key: "description", label: "Description", type: "textarea" },
];

function Gaps() {
  return (
    <WorkspacePage title="Resource Gaps" subtitle="Identified service gaps awaiting partner match." eyebrow="Programs · Workspace" backTo="/board-portal/coo" backLabel="Back to Programs hub">
      <SimpleCrud<Gap>
        table="resource_gaps"
        fields={fields}
        searchKeys={["title", "description"]}
        addLabel="New Gap"
        emptyLabel="No resource gaps logged."
        defaults={{ priority: "normal", status: "open" }}
      />
    </WorkspacePage>
  );
}
