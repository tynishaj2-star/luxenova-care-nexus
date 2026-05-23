import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import communityImg from "@/assets/community-families.jpg";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Transparent impact tracking from LuxeNova Community Wellness — families supported, relief tracked, utility shutoffs avoided, autism family supports connected, and community referrals completed across Massachusetts.",
      },
      { property: "og:title", content: "Impact — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Transparent tracking of family stabilization across Massachusetts.",
      },
      { property: "og:image", content: "/og-impact.jpg" },
    ],
  }),
  component: ImpactPage,
});

const headlineMetrics = [
  { label: "Families Supported", value: "—" },
  { label: "Relief Tracked", value: "$—" },
  { label: "Zip Codes Served", value: "—" },
  { label: "Referrals Completed", value: "—" },
];

const detailMetrics = [
  { label: "Utility shutoffs avoided", value: "—" },
  { label: "Rent emergencies documented", value: "—" },
  { label: "Autism family supports connected", value: "—" },
  { label: "Community referrals completed", value: "—" },
];

function ImpactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Impact"
          title="Transparent. Documented. Community-centered."
          description="As an emerging Massachusetts community relief initiative, LuxeNova publishes impact transparently. Numbers below will populate as families are served."
        />

        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {headlineMetrics.map((m) => (
                <article
                  key={m.label}
                  className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft"
                >
                  <p className="font-display text-4xl text-foreground">{m.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {m.label}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe">
              <img
                src={communityImg}
                alt="A diverse group of Black families and children gathered at a Massachusetts community outreach event"
                width={1536}
                height={1024}
                loading="lazy"
                className="h-72 w-full object-cover md:h-96"
              />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-3xl md:text-4xl">Stabilization indicators</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {detailMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
                  >
                    <p className="text-sm text-foreground/80">{m.label}</p>
                    <p className="font-display text-2xl">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-border/70 bg-card p-8 shadow-soft md:p-10">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Our reporting commitment</p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                LuxeNova Community Wellness commits to publishing meaningful
                impact metrics as the initiative grows — not vanity numbers.
                Every dollar of relief, every referral completed, and every
                family stabilized is tracked, documented, and reported back to
                donors, sponsors, and the communities we serve.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
