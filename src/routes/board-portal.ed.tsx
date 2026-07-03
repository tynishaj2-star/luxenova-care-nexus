import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/board-portal/ed")({
  head: () => ({
    meta: [
      { title: "Executive Director — Board Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EdLayout,
});

function EdLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/login" }); return; }
      const { data } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" });
      setState(data ? "ok" : "denied");
    })();
  }, [navigate]);

  if (state === "loading") {
    return <div className="min-h-screen grid place-items-center bg-gradient-warm"><p className="text-sm text-muted-foreground">Verifying admin access…</p></div>;
  }
  if (state === "denied") {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-warm px-6">
        <div className="max-w-md rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft">
          <h1 className="font-display text-2xl">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Only the Executive Director can access this workspace.</p>
          <button onClick={() => navigate({ to: "/board-portal" })} className="mt-6 rounded-full bg-gradient-rosewood px-5 py-2 text-sm text-rosewood-foreground shadow-luxe">Back to portal</button>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
