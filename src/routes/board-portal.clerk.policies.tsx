import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/clerk/policies")({
  head: () => ({ meta: [{ title: "Policies — Clerk" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Policies,
});

type Pol = { id: string; title: string; category: string | null; body: string | null; effective_at: string | null; version: string | null };
const fields: FieldDef<Pol>[] = [
  { key: "title", label: "Title", required: true },
  { key: "category", label: "Category", type: "select", options: ["Governance", "Conflict of Interest", "Financial", "HR", "Volunteer", "Privacy", "Other"] },
  { key: "version", label: "Version" },
  { key: "effective_at", label: "Effective date", type: "date" },
  { key: "body", label: "Policy body", type: "textarea" },
];

function Policies() {
  return (
    <WorkspacePage title="Policies" subtitle="Governance policies with version tracking." eyebrow="Clerk · Workspace" backTo="/board-portal/clerk" backLabel="Back to Clerk hub">
      <SimpleCrud<Pol>
        table="org_policies"
        fields={fields}
        orderBy="title"
        ascending
        searchKeys={["title", "category", "body"]}
        addLabel="New Policy"
        emptyLabel="No policies yet."
      />
    </WorkspacePage>
  );
}
