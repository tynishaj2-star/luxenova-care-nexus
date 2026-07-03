import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { SimpleCrud, type FieldDef } from "@/components/portal/workspace/SimpleCrud";

export const Route = createFileRoute("/board-portal/clerk/votes")({
  head: () => ({ meta: [{ title: "Board Votes — Clerk" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Votes,
});

type Vote = { id: string; motion: string; meeting_date: string | null; outcome: string | null };
const fields: FieldDef<Vote>[] = [
  { key: "meeting_date", label: "Meeting date", type: "date" },
  { key: "motion", label: "Motion text", type: "textarea", required: true },
  { key: "outcome", label: "Outcome", type: "select", options: ["passed", "failed", "tabled", "withdrawn"] },
];

function Votes() {
  return (
    <WorkspacePage title="Board Votes" subtitle="Motions and voting outcomes." eyebrow="Clerk · Workspace" backTo="/board-portal/clerk" backLabel="Back to Clerk hub">
      <SimpleCrud<Vote>
        table="board_votes"
        fields={fields}
        orderBy="meeting_date"
        searchKeys={["motion", "outcome"]}
        addLabel="New Vote"
        emptyLabel="No votes recorded yet."
      />
    </WorkspacePage>
  );
}
