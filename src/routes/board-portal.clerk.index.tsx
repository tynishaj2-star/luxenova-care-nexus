import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { ScrollText, CalendarCheck, Gavel, ClipboardList, Vote, Activity } from "lucide-react";

export const Route = createFileRoute("/board-portal/clerk/")({
  head: () => ({ meta: [{ title: "Clerk Hub — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ClerkHub,
});

const tiles = [
  { to: "/board-portal/clerk/minutes", label: "Board Minutes", desc: "Draft, edit, and approve minutes.", icon: ScrollText },
  { to: "/board-portal/clerk/records", label: "Meeting Records", desc: "Attendance, quorum, and outcomes.", icon: CalendarCheck },
  { to: "/board-portal/clerk/policies", label: "Policies", desc: "Governance policies with version history.", icon: Gavel },
  { to: "/board-portal/clerk/filings", label: "Filing Tracker", desc: "State and federal filing due dates.", icon: ClipboardList },
  { to: "/board-portal/clerk/votes", label: "Board Votes", desc: "Motions and voting outcomes.", icon: Vote },
] as const;

function ClerkHub() {
  const [activity, setActivity] = useState<Array<{ id: string; summary: string; entity_type: string; created_at: string }>>([]);
  useEffect(() => {
    supabase.from("activity_feed").select("id,summary,entity_type,created_at")
      .in("entity_type", ["board_minutes", "meeting_records", "org_policies", "filings", "board_votes"])
      .order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setActivity(data ?? []));
  }, []);

  return (
    <WorkspacePage
      title="Clerk / Secretary Hub"
      subtitle="Governance records, meeting minutes, policies, and compliance filings."
      eyebrow="Clerk · Workspace"
      backTo="/board-portal"
      backLabel="Back to board portal"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/40 hover:shadow-luxe">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood"><t.icon className="h-5 w-5" strokeWidth={1.5} /></span>
              <h3 className="font-display text-base">{t.label}</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-rosewood">Open workspace →</p>
          </Link>
        ))}
      </div>
      <section className="mt-10 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-accent/50 text-rosewood"><Activity className="h-4 w-4" strokeWidth={1.5} /></span>
          <h2 className="font-display text-base">Recent Governance Activity</h2>
        </div>
        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {activity.map((a) => (
              <li key={a.id} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
                <span className="text-sm capitalize">{a.summary}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{a.entity_type} · {new Date(a.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </WorkspacePage>
  );
}
