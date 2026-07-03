import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/coo/feedback")({
  head: () => ({ meta: [{ title: "Partner Feedback — Programs" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Feedback,
});

type FB = { id: string; partner_name: string; kind: string | null; body: string; submitted_at: string };
const fields: FieldDef<FB>[] = [
  { key: "partner_name", label: "Partner name", required: true },
  { key: "kind", label: "Kind", type: "select", options: ["church", "school", "agency", "clinic", "government", "other"] },
  { key: "submitted_at", label: "Received on", type: "date" },
  { key: "body", label: "Feedback", type: "textarea", required: true },
];

function Feedback() {
  return (
    <WorkspacePage title="Partner Feedback" subtitle="Notes from churches, schools, agencies, and other partners." eyebrow="Programs · Workspace" backTo="/board-portal/coo" backLabel="Back to Programs hub">
      <SimpleCrud<FB>
        table="partner_feedback"
        fields={fields}
        orderBy="submitted_at"
        searchKeys={["partner_name", "body", "kind"]}
        addLabel="New Feedback"
        emptyLabel="No feedback recorded yet."
        defaults={{ submitted_at: new Date().toISOString().slice(0, 10) }}
      />
    </WorkspacePage>
  );
}
