import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BackofficeGuard } from "@/components/portal/workspace/BackofficeGuard";

export const Route = createFileRoute("/board-portal/coo")({
  head: () => ({ meta: [{ title: "Programs Director — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <BackofficeGuard allow={["coo"]} denyTitle="Director access required" denyBody="Only the Programs Director or Executive Director can access this workspace.">
      <Outlet />
    </BackofficeGuard>
  ),
});
