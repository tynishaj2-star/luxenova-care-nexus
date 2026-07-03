import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BackofficeGuard } from "@/components/portal/workspace/BackofficeGuard";

export const Route = createFileRoute("/board-portal/clerk")({
  head: () => ({ meta: [{ title: "Clerk / Secretary — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <BackofficeGuard allow={["clerk"]} denyTitle="Clerk access required" denyBody="Only the Clerk/Secretary or Executive Director can access this workspace.">
      <Outlet />
    </BackofficeGuard>
  ),
});
