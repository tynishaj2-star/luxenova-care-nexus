import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { WhyUs } from "@/components/site/WhyUs";
import { Partners } from "@/components/site/Partners";

import { Testimonials } from "@/components/site/Testimonials";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LuxeNova Community Wellness — Care Coordination & Community Support" },
      {
        name: "description",
        content:
          "LuxeNova Community Wellness provides modern care coordination, housing navigation, family support, and community-based behavioral health services.",
      },
      { property: "og:title", content: "LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Compassionate community support. Modern care coordination for individuals, families, and referral partners.",
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
        <Services />
        <WhyUs />
        <Partners />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
