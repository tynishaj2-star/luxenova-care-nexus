import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { CalendarCheck, Wallet, ShoppingBag, Truck, Package, Receipt, DollarSign, ClipboardList, Activity } from "lucide-react";

export const Route = createFileRoute("/board-portal/events/")({
  head: () => ({ meta: [{ title: "Events Hub — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: EventsHub,
});

const tiles = [
  { to: "/board-portal/calendar", label: "Events Calendar", desc: "All upcoming events.", icon: CalendarCheck },
  { to: "/board-portal/events/budgets", label: "Event Budgets", desc: "Per-event budget by category.", icon: Wallet },
  { to: "/board-portal/events/purchase-requests", label: "Purchase Requests", desc: "Approvals for event purchases.", icon: ClipboardList },
  { to: "/board-portal/events/reimbursements", label: "Reimbursements", desc: "Out-of-pocket reimbursements.", icon: DollarSign },
  { to: "/board-portal/events/vendors", label: "Vendor Directory", desc: "Vendor contacts and pricing.", icon: Truck },
  { to: "/board-portal/events/inventory", label: "Inventory", desc: "Tables, chairs, décor, tents.", icon: Package },
  { to: "/board-portal/events/shopping", label: "Shopping Lists", desc: "Event shopping checklists.", icon: ShoppingBag },
  { to: "/board-portal/cfo/expenses", label: "Event Expenses", desc: "Log expenses with receipts.", icon: Receipt },
] as const;

function EventsHub() {
  const [upcoming, setUpcoming] = useState<Array<{ id: string; title: string; start_at: string }>>([]);
  const [activity, setActivity] = useState<Array<{ id: string; summary: string; entity_type: string; created_at: string }>>([]);

  useEffect(() => {
    supabase.from("calendar_events").select("id,title,start_at").gte("start_at", new Date().toISOString()).order("start_at", { ascending: true }).limit(5)
      .then(({ data }) => setUpcoming(data ?? []));
    supabase.from("activity_feed").select("id,summary,entity_type,created_at")
      .in("entity_type", ["calendar_events", "event_budgets", "purchase_requests", "reimbursements", "vendors", "inventory_items", "shopping_lists", "shopping_list_items"])
      .order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setActivity(data ?? []));
  }, []);

  return (
    <WorkspacePage
      title="Events Hub"
      subtitle="Plan events, track budgets, manage vendors and logistics."
      eyebrow="Events · Workspace"
      backTo="/board-portal"
      backLabel="Back to board portal"
    >
      <DataCard>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Next Events</p>
        {upcoming.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Nothing scheduled.</p> : (
          <ul className="mt-3 space-y-2">
            {upcoming.map((e) => (
              <li key={e.id} className="flex justify-between border-b border-border/60 pb-2 last:border-0">
                <span className="text-sm">{e.title}</span>
                <span className="text-xs text-muted-foreground">{new Date(e.start_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </DataCard>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/40 hover:shadow-luxe">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood"><t.icon className="h-5 w-5" strokeWidth={1.5} /></span>
              <h3 className="font-display text-base">{t.label}</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-accent/50 text-rosewood"><Activity className="h-4 w-4" strokeWidth={1.5} /></span>
          <h2 className="font-display text-base">Recent Events Activity</h2>
        </div>
        {activity.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No activity yet.</p> : (
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
