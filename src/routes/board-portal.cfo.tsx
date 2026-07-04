import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getJobRole } from "@/lib/staff-roles";

export const Route = createFileRoute("/board-portal/cfo")({
  head: () => ({
    meta: [
      { title: "Treasurer — Board Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CfoLayout,
});

function CfoLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/login" }); return; }
      const email = session.user.email ?? null;
      const job = getJobRole(email);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const roleList = roles?.map((r) => r.role) ?? [];
      const isAdmin = roleList.includes("admin");
      const isStaff = roleList.includes("staff") || roleList.includes("board");
      // Admin (ED) can also enter; CFO staff can enter.
      if (isAdmin || (isStaff && (job === "cfo" || job === "admin"))) {
        setState("ok");
      } else {
        setState("denied");
      }
    })();
  }, [navigate]);

  if (state === "loading") {
    return <div className="min-h-screen grid place-items-center bg-gradient-warm"><p className="text-sm text-muted-foreground">Verifying treasurer access…</p></div>;
  }
  if (state === "denied") {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-warm px-6">
        <div className="max-w-md rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft">
          <h1 className="font-display text-2xl">Treasurer access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Only the Treasurer/CFO or Executive Director can access this workspace.</p>
          <button onClick={() => navigate({ to: "/board-portal" })} className="mt-6 rounded-full bg-gradient-rosewood px-5 py-2 text-sm text-rosewood-foreground shadow-luxe">Back to portal</button>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
