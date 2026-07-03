import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getJobRole, type JobRole } from "@/lib/staff-roles";

/**
 * Gates a back-office subtree by staff job role. Admin always passes.
 * Renders children only when authorized.
 */
export function BackofficeGuard({
  allow,
  denyTitle,
  denyBody,
  children,
}: {
  allow: JobRole[];
  denyTitle: string;
  denyBody: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/login" }); return; }
      const email = session.user.email ?? null;
      const job = getJobRole(email);
      const [{ data: isAdmin }, { data: isStaff }] = await Promise.all([
        supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }),
        supabase.rpc("has_role", { _user_id: session.user.id, _role: "staff" }),
      ]);
      if (isAdmin || (isStaff && (allow.includes(job) || job === "admin"))) {
        setState("ok");
      } else {
        setState("denied");
      }
    })();
  }, [navigate, allow]);

  if (state === "loading") {
    return <div className="min-h-screen grid place-items-center bg-gradient-warm"><p className="text-sm text-muted-foreground">Verifying access…</p></div>;
  }
  if (state === "denied") {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-warm px-6">
        <div className="max-w-md rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft">
          <h1 className="font-display text-2xl">{denyTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{denyBody}</p>
          <button onClick={() => navigate({ to: "/board-portal" })} className="mt-6 rounded-full bg-gradient-rosewood px-5 py-2 text-sm text-rosewood-foreground shadow-luxe">Back to portal</button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
