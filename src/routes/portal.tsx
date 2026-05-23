import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, LayoutDashboard, Users, Inbox, FileText, Heart } from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Employee Login — LuxeNova Community Wellness" },
      { name: "description", content: "Internal relief intake dashboard for LuxeNova navigators and outreach staff." },
    ],
  }),
  component: Portal,
});

const tiles = [
  { icon: Inbox, title: "Stabilization Requests", body: "Review incoming Emergency Stabilization Requests, urgency level, and primary barrier." },
  { icon: FileText, title: "Household Documents", body: "Securely access uploaded rent notices, utility bills, and supporting documentation." },
  { icon: Users, title: "Navigators & Assignments", body: "Assign navigators, track household size, children, and autism family support needs." },
  { icon: Heart, title: "Relief Tracking", body: "Document requested amounts, relief delivered, utility shutoffs avoided, and outcomes." },
  { icon: LayoutDashboard, title: "Impact Dashboard", body: "Aggregate metrics across zip codes, programs, and stabilization indicators." },
  { icon: ShieldCheck, title: "Internal Notes", body: "Confidential internal notes, status updates, and partner coordination logs." },
];

function Portal() {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
            L
          </span>
          <span className="font-display text-lg">LuxeNova Community Wellness — Relief Intake</span>
        </Link>
        <Link
          to="/"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
        >
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Employee Login</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl text-balance md:text-6xl">
          The internal relief intake dashboard.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          A secure workspace for LuxeNova navigators and outreach staff to
          track Emergency Stabilization Requests, household needs, uploaded
          documents, assigned navigators, status, internal notes, and
          documented impact.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <article
              key={t.title}
              className="group rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                <t.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 font-display text-xl">{t.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
          <h3 className="font-display text-xl">Ready to activate secure logins & data?</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            To enable employee accounts, secure document storage, request
            tracking, and impact dashboards, we'll connect a secure backend.
            Let us know when you'd like to activate it.
          </p>
        </div>
      </main>
    </div>
  );
}
