import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, LayoutDashboard, Users, Inbox } from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Portal — LuxeNova Community Wellness" },
      { name: "description", content: "Secure portal for referral partners, clients, and LuxeNova staff." },
    ],
  }),
  component: Portal,
});

const tiles = [
  { icon: Users, title: "Referral Partner Portal", body: "Submit referrals, upload documents, and track status in real time." },
  { icon: ShieldCheck, title: "Client Portal", body: "Securely complete intake, view appointments, and message your coordinator." },
  { icon: LayoutDashboard, title: "Admin Dashboard", body: "Manage intake, assignments, analytics, and audit logs across the organization." },
  { icon: Inbox, title: "Communication Center", body: "Encrypted messaging and notifications between partners, clients, and staff." },
];

function Portal() {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
            L
          </span>
          <span className="font-display text-lg">LuxeNova · Portal</span>
        </Link>
        <Link
          to="/"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
        >
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Coming soon</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl text-balance md:text-6xl">
          A secure, modern hub for partners, clients, and our team.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          The LuxeNova portal is being rolled out in phases. Below is a preview
          of the workspaces we're building. Connect a backend to enable secure
          accounts, document storage, messaging, and referral workflows.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {tiles.map((t) => (
            <article
              key={t.title}
              className="group rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                <t.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 font-display text-2xl">{t.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
          <h3 className="font-display text-xl">Ready to activate accounts & data?</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            To enable secure logins, document uploads, referral tracking, and
            admin dashboards, we'll need to connect Lovable Cloud (authentication,
            database, file storage, and serverless functions). Let me know when
            you'd like to enable it and I'll wire up the portal end-to-end.
          </p>
        </div>
      </main>
    </div>
  );
}
