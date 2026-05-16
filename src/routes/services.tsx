import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { Services } from "@/components/site/Services";
import { ReferralCTA } from "@/components/site/ReferralCTA";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Explore LuxeNova Community Wellness services: care coordination, housing navigation, family support, wellness advocacy, and more.",
      },
      { property: "og:title", content: "LuxeNova Services" },
      {
        property: "og:description",
        content:
          "A continuum of care — organized around the people we serve.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Services"
          title="Built for the whole person."
          description="Personalized care coordination across clinical, social, and community resources."
        />
        <Services />
        <ReferralCTA />
      </main>
      <Footer />
    </div>
  );
}
