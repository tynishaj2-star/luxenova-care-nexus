import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/events/budgets")({
  head: () => ({ meta: [{ title: "Event Budgets — Events" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Budgets,
});

type Budget = { id: string; event_id: string | null; category: string; planned_cents: number; notes: string | null };

function Budgets() {
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>([]);
  useEffect(() => {
    supabase.from("calendar_events").select("id,title").order("start_at", { ascending: false })
      .then(({ data }) => setEvents(data ?? []));
  }, []);
  const eventOptions = events.map((e) => e.id);
  const eventLabels: Record<string, string> = Object.fromEntries(events.map((e) => [e.id, e.title]));
  const eventLabel = (id: unknown) => eventLabels[String(id)] ?? "—";

  const fields: FieldDef<Budget>[] = [
    { key: "event_id", label: "Event", type: "select", options: eventOptions, optionLabels: eventLabels, required: true, formatCell: (v) => eventLabel(v) },
    { key: "category", label: "Category", required: true, placeholder: "Catering, décor, rentals…" },
    { key: "planned_cents", label: "Planned amount (USD)", type: "money", required: true },
    { key: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <WorkspacePage title="Event Budgets" subtitle="Per-event budget by category." eyebrow="Events · Workspace" backTo="/board-portal/events" backLabel="Back to Events hub">
      <SimpleCrud<Budget>
        table="event_budgets"
        fields={fields}
        searchKeys={["category", "notes"]}
        addLabel="Add Budget Line"
        emptyLabel="No budget lines yet."
      />
    </WorkspacePage>
  );
}
