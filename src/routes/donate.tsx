import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { Heart, HandCoins, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Support LuxeNova Community Wellness — transparent community relief funding for Massachusetts families facing rent emergencies, utility shutoffs, autism support needs, and stabilization barriers.",
      },
      { property: "og:title", content: "Donate — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Help stabilize Massachusetts families with transparent community relief funding.",
      },
    ],
  }),
  component: DonatePage,
});

const tiers = [
  { amount: "$25", body: "Helps with documents, transportation, or urgent basics." },
  { amount: "$75", body: "Supports utility relief navigation and family follow-up." },
  { amount: "$150", body: "Helps stabilize a household facing an urgent gap." },
  { amount: "Monthly", body: "Builds consistent emergency relief capacity." },
];

function DonatePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Donate"
          title="Fund family stabilization. With transparency."
          description="LuxeNova Community Wellness is building transparent community relief funding for Massachusetts families facing rent emergencies, utility shutoffs, autism-related support needs, and stabilization barriers."
        />

        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.map((t) => (
                <article
                  key={t.amount}
                  className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-rosewood">
                    <HandCoins className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <p className="mt-6 font-display text-3xl">{t.amount}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-border/70 bg-card p-8 shadow-luxe md:p-12">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Give today</p>
                  <h2 className="mt-3 font-display text-3xl md:text-4xl">Direct support for families in crisis.</h2>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Our secure donation portal is being finalized. In the
                    meantime, sponsor a family or contact our team to coordinate
                    a gift, partnership, or recurring sponsorship.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-rosewood px-7 py-3.5 text-sm font-medium text-rosewood-foreground shadow-luxe opacity-70"
                  >
                    <Heart className="h-4 w-4" /> Donation Link Coming Soon
                  </button>
                  <Link
                    to="/sponsor-a-family"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 text-sm font-medium text-foreground transition hover:border-foreground/30"
                  >
                    <Users className="h-4 w-4" /> Sponsor a Family
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <Sparkles className="h-5 w-5 text-rosewood" />
                <h3 className="mt-4 font-display text-xl">Transparent impact</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We track families supported, relief delivered, and outcomes
                  documented — published on our Impact page.
                </p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <Users className="h-5 w-5 text-rosewood" />
                <h3 className="mt-4 font-display text-xl">Sponsor & partner ready</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Built for donor and sponsor coordination — household
                  sponsorships, matching gifts, and community partnerships.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
