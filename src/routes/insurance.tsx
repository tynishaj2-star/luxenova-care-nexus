import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { Home, Zap, Puzzle, Compass } from "lucide-react";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Eligibility & Access — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Who LuxeNova Community Wellness can help — Massachusetts families facing rent, utility, autism support, and resource barriers.",
      },
    ],
  }),
  component: EligibilityPage,
});

const blocks = [
  {
    icon: Home,
    title: "Rent & Housing Stress",
    body: "Families facing rent emergencies, late notices, eviction risk, or housing instability across Massachusetts.",
  },
  {
    icon: Zap,
    title: "Utility Shutoff Risk",
    body: "Households facing gas, electric, or water shutoff notices, especially during heat or cold-weather emergencies.",
  },
  {
    icon: Puzzle,
    title: "Autism Family Support",
    body: "Households raising autistic children who need resource navigation, family support, or community connection.",
  },
  {
    icon: Compass,
    title: "Resource & Documentation Barriers",
    body: "Families struggling to access benefits, complete documentation, or navigate fragmented community resources.",
  },
];

function EligibilityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Eligibility & Access"
          title="Who LuxeNova helps."
          description="LuxeNova Community Wellness supports Massachusetts families facing housing, utility, autism-related, and resource barriers. Every request is reviewed individually."
        />
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 md:grid-cols-2">
              {blocks.map((b) => (
                <article
                  key={b.title}
                  className="rounded-3xl border border-border/70 bg-card p-8 shadow-soft"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-rosewood">
                    <b.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h2 className="mt-6 font-display text-2xl">{b.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Link
                to="/referrals"
                className="inline-flex items-center rounded-full bg-gradient-rosewood px-7 py-3.5 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
              >
                Request Help
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition hover:border-foreground/30"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
