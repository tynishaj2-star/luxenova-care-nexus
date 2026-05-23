import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CalloutNote } from "@/components/site/ContentPage";

export const Route = createFileRoute("/nonprofit-status")({
  head: () => ({
    meta: [
      { title: "Nonprofit Status — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Current nonprofit status of LuxeNova Community Wellness — mission and program structure, board formation, nonprofit filings, and donation processing.",
      },
      { property: "og:title", content: "Nonprofit Status — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content: "Honest, current status of our nonprofit structure.",
      },
    ],
  }),
  component: NonprofitStatusPage,
});

const statuses = [
  { title: "Mission and program structure", state: "In progress", body: "Mission, programs, eligibility, and intake pathways are defined and being refined as families are served." },
  { title: "Board formation", state: "In progress", body: "Board roles and responsibilities are being structured. Community members and partners are being engaged for board service." },
  { title: "Nonprofit filings and EIN", state: "Next step", body: "Formal nonprofit incorporation, EIN registration, and 501(c)(3) application are scheduled as the next phase." },
  { title: "Donation processing", state: "Preparing", body: "Donation infrastructure is being set up to ensure secure, transparent, and policy-compliant giving from day one." },
];

const stateStyles: Record<string, string> = {
  "In progress": "bg-rosewood/15 text-rosewood",
  "Next step": "bg-taupe/20 text-foreground/80",
  Preparing: "bg-accent text-foreground/80",
};

function NonprofitStatusPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Nonprofit Status"
          title="Honest about where we are."
          description="The current structural status of LuxeNova Community Wellness, published openly so donors and partners can make informed decisions."
        />
        <section className="pb-12">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {statuses.map((s) => (
                <article
                  key={s.title}
                  className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
                      stateStyles[s.state] ?? "bg-accent text-foreground/80"
                    }`}
                  >
                    {s.state}
                  </span>
                  <h3 className="mt-5 font-display text-xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <CalloutNote>
          LuxeNova Community Wellness is being structured as a community
          relief and family stabilization initiative. Donation
          tax-deductibility, grant eligibility, and formal nonprofit
          status should be confirmed here before donors rely on them.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
