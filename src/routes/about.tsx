import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { WhoWeAre } from "@/components/site/WhoWeAre";
import { WhyUs } from "@/components/site/WhyUs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Mission — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "LuxeNova Community Wellness is a Massachusetts community relief and family stabilization initiative — built on dignity, transparency, and care.",
      },
      { property: "og:title", content: "Our Mission — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Helping Massachusetts families stabilize through housing, utility, autism support, and resource barriers.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Mission"
          title="Stabilizing families. Strengthening communities."
          description="LuxeNova Community Wellness is a Massachusetts community relief and family stabilization initiative supporting households through housing, utility, autism-related, and resource barriers."
        />
        <WhoWeAre />
        <WhyUs />
      </main>
      <Footer />
    </div>
  );
}
