import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/events/vendors")({
  head: () => ({ meta: [{ title: "Vendors — Events" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Vendors,
});

type Vendor = { id: string; name: string; category: string | null; contact: string | null; phone: string | null; email: string | null; notes: string | null };
const fields: FieldDef<Vendor>[] = [
  { key: "name", label: "Vendor name", required: true },
  { key: "category", label: "Category", type: "select", options: ["catering", "rentals", "florist", "photography", "printing", "venue", "transport", "decor", "other"] },
  { key: "contact", label: "Contact person" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "notes", label: "Notes", type: "textarea" },
];

function Vendors() {
  return (
    <WorkspacePage title="Vendor Directory" subtitle="Contacts, contracts, and pricing history." eyebrow="Events · Workspace" backTo="/board-portal/events" backLabel="Back to Events hub">
      <SimpleCrud<Vendor>
        table="vendors"
        fields={fields}
        orderBy="name"
        ascending
        searchKeys={["name", "category", "contact", "email"]}
        addLabel="New Vendor"
        emptyLabel="No vendors yet."
      />
    </WorkspacePage>
  );
}
