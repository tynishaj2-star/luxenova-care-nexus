import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { WhoWeAre } from "@/components/site/WhoWeAre";
import { WhyUs } from "@/components/site/WhyUs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Learn about LuxeNova Community Wellness — our mission, support approach, and commitment to compassionate, community-based care.",
      },
      { property: "og:title", content: "About LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Compassionate, organized, community-based support services for individuals and families.",
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
          eyebrow="About"
          title="Care with discipline. Community with heart."
          description="LuxeNova Community Wellness is a modern provider organization built around the families and partners we serve."
        />
        <WhoWeAre />
        <WhyUs />
      </main>
      <Footer />
    </div>
  );
}
