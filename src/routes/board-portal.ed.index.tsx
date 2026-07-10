import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, ShieldCheck, HeartHandshake, DollarSign, PieChart, HandHeart,
  Briefcase, Megaphone, Layers, FileText, Archive, Settings, Activity, Backpack,
} from "lucide-react";
import { WorkspacePage } from "@/components/portal/workspace/WorkspacePage";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/board-portal/ed/")({
  head: () => ({ meta: [{ title: "Executive Director Hub — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: EdHub,
});

const tiles = [
  { to: "/board-portal/ed/board", label: "Board Management", desc: "Members, roles, portal access.", icon: Users },
  { to: "/board-portal/ed/users", label: "User Management", desc: "Assign or revoke portal roles.", icon: ShieldCheck },
  { to: "/board-portal/ed/grants", label: "Grant Management", desc: "Pipeline, awards, reports due.", icon: Briefcase },
  { to: "/board-portal/ed/donations", label: "Donations", desc: "Record, acknowledge, export.", icon: HeartHandshake },
  { to: "/board-portal/ed/financial-reports", label: "Financial Reports", desc: "Period reports & exports.", icon: DollarSign },
  { to: "/board-portal/ed/volunteers", label: "Volunteer Management", desc: "Records, hours, checks.", icon: HandHeart },
  { to: "/board-portal/ed/staff", label: "Staff Management", desc: "Team roster and status.", icon: Users },
  { to: "/board-portal/ed/website", label: "Website Management", desc: "Announcements & site updates.", icon: Megaphone },
  { to: "/board-portal/ed/programs", label: "Program Management", desc: "Programs & outcomes.", icon: Layers },
  { to: "/board-portal/ed/reports", label: "Reports Hub", desc: "Impact & audit reports.", icon: PieChart },
  { to: "/board-portal/ed/documents", label: "Organization Documents", desc: "Bylaws, filings, EIN.", icon: FileText },
  { to: "/board-portal/ed/audit", label: "Audit Logs", desc: "Full activity trail.", icon: Archive },
  { to: "/board-portal/ed/settings", label: "Settings", desc: "Org profile & branding.", icon: Settings },
] as const;

function EdHub() {
  const [activity, setActivity] = useState<Array<{ id: string; summary: string; entity_type: string; created_at: string }>>([]);
  useEffect(() => {
    supabase.from("activity_feed").select("id,summary,entity_type,created_at").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setActivity(data ?? []));
  }, []);

  return (
    <WorkspacePage
      title="Executive Director Hub"
      subtitle="Full oversight across LuxeNova Community Wellness, Inc. — every workspace, every record."
      backTo="/board-portal"
      backLabel="Back to dashboard"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/40 hover:shadow-luxe"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood">
                <t.icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="font-display text-base">{t.label}</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-rosewood">Open workspace →</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-accent/50 text-rosewood">
            <Activity className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <h2 className="font-display text-base">Recent Activity</h2>
        </div>
        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No activity yet. It'll appear as records are created or updated.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {activity.map((a) => (
              <li key={a.id} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
                <span className="text-sm capitalize">{a.summary}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {a.entity_type} · {new Date(a.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/board-portal/ed/audit" className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-rosewood">
          View full audit log →
        </Link>
      </section>

      <div id="print-styles" aria-hidden />
    </WorkspacePage>
  );
}
