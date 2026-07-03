import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/events/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Events" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Inv,
});

type I = { id: string; name: string; category: string | null; quantity: number; location: string | null; notes: string | null };
const fields: FieldDef<I>[] = [
  { key: "name", label: "Item", required: true },
  { key: "category", label: "Category", type: "select", options: ["tables", "chairs", "linens", "decor", "tents", "signs", "storage", "equipment", "other"] },
  { key: "quantity", label: "Quantity", type: "number", required: true },
  { key: "location", label: "Location" },
  { key: "notes", label: "Notes", type: "textarea" },
];

function Inv() {
  return (
    <WorkspacePage title="Inventory" subtitle="Tables, chairs, linens, décor, tents, signs, storage." eyebrow="Events · Workspace" backTo="/board-portal/events" backLabel="Back to Events hub">
      <SimpleCrud<I>
        table="inventory_items"
        fields={fields}
        orderBy="name"
        ascending
        searchKeys={["name", "category", "location", "notes"]}
        addLabel="New Item"
        emptyLabel="No inventory logged yet."
        defaults={{ quantity: 1 }}
      />
    </WorkspacePage>
  );
}
