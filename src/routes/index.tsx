import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { GivebutterEmbed } from "@/components/site/GivebutterEmbed";
import { Services } from "@/components/site/Services";
import { WhoWeAre } from "@/components/site/WhoWeAre";
import { CommunitiesWeServe } from "@/components/site/CommunitiesWeServe";
import { WhyUs } from "@/components/site/WhyUs";
import { Partners } from "@/components/site/Partners";
import { ReferralCTA } from "@/components/site/ReferralCTA";
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LuxeNova Community Wellness — Helping Massachusetts Families Stabilize" },
      {
        name: "description",
        content:
          "LuxeNova Community Wellness is a Massachusetts community relief initiative supporting families through emergency rental assistance, utility relief, autism family support, and resource navigation.",
      },
      { property: "og:title", content: "LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Helping families stabilize before crisis becomes collapse. Massachusetts community relief and family stabilization support.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <WhoWeAre />
        <CommunitiesWeServe />
        <Services />
        <WhyUs />
        <ReferralCTA />
        <Partners />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
