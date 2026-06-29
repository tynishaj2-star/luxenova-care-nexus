import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CalloutNote } from "@/components/site/ContentPage";

export const Route = createFileRoute("/nonprofit-status")({
  head: () => ({
    meta: [
      { title: "Nonprofit Status — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Current nonprofit status of LuxeNova Community Wellness, Inc. — mission and program structure, board formation, nonprofit filings, and donation processing.",
      },
      { property: "og:title", content: "Nonprofit Status — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "Honest, current status of our nonprofit structure.",
      },
    ],
  }),
  component: NonprofitStatusPage,
});

const statuses = [
  { title: "Mission and program structure", state: "Established", body: "Mission, programs, eligibility, and intake pathways are clearly defined and actively serving families across Massachusetts." },
  { title: "Board governance", state: "Active", body: "Board officers and governance framework are in place, providing oversight, accountability, and mission alignment." },
  { title: "Nonprofit incorporation and EIN", state: "Approved", body: "LuxeNova Community Wellness, Inc. is incorporated as a nonprofit organization with a registered EIN and recognized 501(c)(3) status." },
  { title: "Donation processing", state: "Active", body: "Secure, transparent, and policy-compliant donation infrastructure is live and accepting contributions." },
];

const stateStyles: Record<string, string> = {
  Established: "bg-rosewood/15 text-rosewood",
  Active: "bg-rosewood/15 text-rosewood",
  Approved: "bg-rosewood/15 text-rosewood",
};

function NonprofitStatusPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Nonprofit Status"
          title="A recognized 501(c)(3) nonprofit."
          description="LuxeNova Community Wellness, Inc. is an established nonprofit organization serving Massachusetts families with transparency, accountability, and care."
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
          LuxeNova Community Wellness, Inc. operates as a recognized 501(c)(3)
          nonprofit. Donations are tax-deductible to the fullest extent
          allowed by law, and the organization is eligible for grants
          and institutional funding.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
