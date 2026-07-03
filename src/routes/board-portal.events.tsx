import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BackofficeGuard } from "@/components/portal/workspace/BackofficeGuard";

export const Route = createFileRoute("/board-portal/events")({
  head: () => ({ meta: [{ title: "Events — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <BackofficeGuard allow={["events"]} denyTitle="Events access required" denyBody="Only the Events organizer or Executive Director can access this workspace.">
      <Outlet />
    </BackofficeGuard>
  ),
});
