import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/events/reimbursements")({
  head: () => ({ meta: [{ title: "Reimbursements — Events" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Reimb,
});

type R = { id: string; description: string | null; amount_cents: number; status: string; receipt_path: string | null };
const fields: FieldDef<R>[] = [
  { key: "description", label: "Description", required: true },
  { key: "amount_cents", label: "Amount (USD)", type: "money", required: true },
  { key: "status", label: "Status", type: "select", options: ["pending", "approved", "paid", "denied"] },
  { key: "receipt_path", label: "Receipt path (optional)", placeholder: "Upload via file manager and paste path" },
];

function Reimb() {
  return (
    <WorkspacePage title="Reimbursement Requests" subtitle="Submit and track personal out-of-pocket reimbursements." eyebrow="Events · Workspace" backTo="/board-portal/events" backLabel="Back to Events hub">
      <SimpleCrud<R>
        table="reimbursements"
        fields={fields}
        searchKeys={["description"]}
        addLabel="New Reimbursement"
        emptyLabel="No reimbursements yet."
        defaults={{ status: "pending" }}
      />
    </WorkspacePage>
  );
}
