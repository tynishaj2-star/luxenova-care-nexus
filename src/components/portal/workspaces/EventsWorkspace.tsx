import { Link } from "@tanstack/react-router";
import { CalendarDays, Megaphone, Users, ShoppingBasket, DollarSign, ClipboardList } from "lucide-react";

export function EventsWorkspace() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Events & Finance Support Workspace</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Community Drives & Event Operations</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Plan, staff, and close out every community drive and fundraiser, with finance handoff to the Treasurer.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Upcoming drives", value: "—", icon: CalendarDays },
          { label: "Volunteer RSVPs", value: "—", icon: Users },
          { label: "Items collected (MTD)", value: "—", icon: ShoppingBasket },
          { label: "Funds raised (MTD)", value: "—", icon: DollarSign },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k.label}</span>
              <k.icon className="h-4 w-4 text-rosewood" strokeWidth={1.5} />
            </div>
            <p className="mt-3 font-display text-3xl">{k.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Per-event runbook</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Confirm date, venue, permits",
              "Post sign-up & promote on socials",
              "Coordinate volunteer shifts & captains",
              "Order supplies, signage, table setup",
              "Day-of: check-in, donations tracking, photos",
              "Post-event: count, deposit, thank-you outreach",
              "Hand finance summary to Treasurer (Darien)",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rosewood" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Active drives & forms</h2>
          <div className="mt-4 grid gap-2">
            <Link to="/food-drives" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <ShoppingBasket className="h-4 w-4" /> Community Drives interest form
            </Link>
            <Link to="/volunteer" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <Users className="h-4 w-4" /> Volunteer sign-up
            </Link>
            <Link to="/contact" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <Megaphone className="h-4 w-4" /> Contact intake
            </Link>
            <Link to="/donate" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <DollarSign className="h-4 w-4" /> Donation page
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl">Hand-offs</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-3 text-sm">
            <ClipboardList className="mb-1 h-4 w-4 text-rosewood" />
            <p className="font-medium">To Treasurer (Darien)</p>
            <p className="text-xs text-muted-foreground">Cash count, Givebutter export, expense receipts within 48h of each event.</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3 text-sm">
            <ClipboardList className="mb-1 h-4 w-4 text-rosewood" />
            <p className="font-medium">To Clerk (Jerez)</p>
            <p className="text-xs text-muted-foreground">Volunteer roster & sign-in sheet for the official record.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
