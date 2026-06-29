import { Link } from "@tanstack/react-router";
import { BookOpen, FileText, Users, Calendar, Archive, ScrollText } from "lucide-react";

export function ClerkWorkspace() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Clerk / Secretary Workspace</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Records, Minutes & Governance</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Official record-keeper for LuxeNova Community Wellness, Inc. — minutes, bylaws, resolutions, and board correspondence.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Meetings YTD", value: "—", icon: Calendar },
          { label: "Minutes on file", value: "—", icon: BookOpen },
          { label: "Active board members", value: 5, icon: Users },
          { label: "Resolutions passed", value: "—", icon: ScrollText },
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
          <h2 className="font-display text-xl">Per-meeting checklist</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Send notice & agenda 7 days prior",
              "Confirm quorum at start of meeting",
              "Capture motions, votes, and action items",
              "Circulate draft minutes within 7 days",
              "File approved minutes in records archive",
              "Update board roster & contact list as needed",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rosewood" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Governance library</h2>
          <div className="mt-4 grid gap-2">
            <Link to="/bylaws" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <BookOpen className="h-4 w-4" /> Bylaws (Articles I–XV)
            </Link>
            <Link to="/conflict-of-interest" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <FileText className="h-4 w-4" /> Conflict of Interest policy
            </Link>
            <Link to="/governance" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <ScrollText className="h-4 w-4" /> Governance overview
            </Link>
            <Link to="/board" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <Users className="h-4 w-4" /> Board roster
            </Link>
            <Link to="/documents" className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-rosewood/40">
              <Archive className="h-4 w-4" /> Document hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
