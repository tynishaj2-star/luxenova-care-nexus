import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsBell } from "@/components/portal/NotificationsBell";

export function BoardPortalShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/board-portal" className="inline-flex items-center gap-2 text-sm text-foreground hover:text-rosewood">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to dashboard
        </Link>
        <button
          onClick={async () => { await supabase.auth.signOut(); }}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft"
        >
          Sign out
        </button>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft md:p-8">
          <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
