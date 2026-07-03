import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/events/purchase-requests")({
  head: () => ({ meta: [{ title: "Purchase Requests — Events" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PR,
});

type PReq = { id: string; item: string; vendor: string | null; amount_cents: number; status: string; notes: string | null };
const fields: FieldDef<PReq>[] = [
  { key: "item", label: "Item / description", required: true },
  { key: "vendor", label: "Vendor" },
  { key: "amount_cents", label: "Amount (USD)", type: "money", required: true },
  { key: "status", label: "Status", type: "select", options: ["pending", "approved", "denied"] },
  { key: "notes", label: "Notes", type: "textarea" },
];

function PR() {
  return (
    <WorkspacePage title="Purchase Requests" subtitle="Submit and track approvals for event purchases." eyebrow="Events · Workspace" backTo="/board-portal/events" backLabel="Back to Events hub">
      <SimpleCrud<PReq>
        table="purchase_requests"
        fields={fields}
        searchKeys={["item", "vendor", "notes"]}
        addLabel="New Request"
        emptyLabel="No purchase requests yet."
        defaults={{ status: "pending" }}
      />
    </WorkspacePage>
  );
}
