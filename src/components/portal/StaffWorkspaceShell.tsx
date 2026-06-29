import { Link } from "@tanstack/react-router";
import { ShieldCheck, LogOut, Eye, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { JobRole } from "@/lib/staff-roles";
import { JOB_ROLE_LABEL, STAFF_DIRECTORY } from "@/lib/staff-roles";
import { CooWorkspace } from "./workspaces/CooWorkspace";
import { CfoWorkspace } from "./workspaces/CfoWorkspace";
import { EventsWorkspace } from "./workspaces/EventsWorkspace";
import { ClerkWorkspace } from "./workspaces/ClerkWorkspace";

export function renderWorkspace(role: JobRole) {
  switch (role) {
    case "coo":
      return <CooWorkspace />;
    case "cfo":
      return <CfoWorkspace />;
    case "events":
      return <EventsWorkspace />;
    case "clerk":
      return <ClerkWorkspace />;
    default:
      return null;
  }
}

export function StaffWorkspaceShell({
  role,
  viewerName,
  viewerTitle,
  previewing,
  onExitPreview,
}: {
  role: JobRole;
  viewerName: string;
  viewerTitle: string;
  previewing?: boolean;
  onExitPreview?: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {previewing && (
        <div className="bg-rosewood text-rosewood-foreground">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-2 text-sm">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" strokeWidth={1.5} />
              Preview mode — viewing as <strong>{viewerName}</strong> ({JOB_ROLE_LABEL[role]})
            </span>
            <button
              onClick={onExitPreview}
              className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs hover:bg-white/30"
            >
              <X className="h-3 w-3" /> Exit preview
            </button>
          </div>
        </div>
      )}
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
              L
            </span>
            <span className="font-display text-lg">LuxeNova Community Wellness, Inc.</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{viewerName}</p>
              <p className="text-xs text-muted-foreground">{viewerTitle}</p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
              Staff · Confidential
            </span>
            {!previewing && (
              <button
                onClick={() => supabase.auth.signOut()}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-10">{renderWorkspace(role)}</main>
    </div>
  );
}

export { STAFF_DIRECTORY };
