import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { Services } from "@/components/site/Services";
import { ReferralCTA } from "@/components/site/ReferralCTA";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Programs — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "LuxeNova programs include emergency rental assistance, utility relief, autism family support, family stabilization, resource navigation, community outreach, documentation assistance, and partner coordination.",
      },
      { property: "og:title", content: "LuxeNova Programs" },
      {
        property: "og:description",
        content:
          "Community relief, organized around the families we serve.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Programs"
          title="Relief for the whole household."
          description="Coordinated programs that meet families where they are — across housing, utilities, autism support, documentation, and community resources."
        />
        <Services />
        <ReferralCTA />
      </main>
      <Footer />
    </div>
  );
}
