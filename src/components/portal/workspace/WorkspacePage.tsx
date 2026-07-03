import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { NotificationsBell } from "@/components/portal/NotificationsBell";
import { supabase } from "@/integrations/supabase/client";
import type { ReactNode } from "react";

export function WorkspacePage({
  title,
  subtitle,
  actions,
  children,
  backTo = "/board-portal/ed",
  backLabel = "Back to ED hub",
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-foreground hover:text-rosewood">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          {backLabel}
        </Link>
        <div className="flex items-center gap-3">
          <NotificationsBell />
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Executive Director · Workspace</p>
              <h1 className="mt-1 font-display text-2xl md:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export function ActionButton({
  onClick,
  icon: Icon,
  label,
  variant = "default",
  type = "button",
}: {
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  variant?: "default" | "primary" | "danger";
  type?: "button" | "submit";
}) {
  const styles =
    variant === "primary"
      ? "bg-gradient-rosewood text-rosewood-foreground shadow-luxe"
      : variant === "danger"
      ? "border border-destructive/40 bg-background text-destructive"
      : "border border-border bg-card text-foreground shadow-soft";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:opacity-90 ${styles}`}
    >
      {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
      {label}
    </button>
  );
}

export function DataCard({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">{children}</div>;
}
