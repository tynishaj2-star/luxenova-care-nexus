import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, CalloutNote, ContentSection } from "@/components/site/ContentPage";
import { Home, Zap, Puzzle, ShoppingBasket, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/sponsor-a-family")({
  head: () => ({
    meta: [
      { title: "Sponsor a Family — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Sponsor a Massachusetts family through LuxeNova Community Wellness, Inc. — rent gaps, utility relief, autism family support, and essentials. For donors, churches, businesses, and community groups.",
      },
      { property: "og:title", content: "Sponsor a Family — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "Sponsor pathways for donors, churches, businesses, and community groups.",
      },
    ],
  }),
  component: SponsorPage,
});

const categories = [
  { icon: Home, title: "Sponsor a rent gap", body: "Help close the gap on a documented rent emergency for a Massachusetts household at risk of displacement." },
  { icon: Zap, title: "Sponsor utility relief", body: "Cover a utility shortfall before service is lost — gas, electric, or water — for a verified family in need." },
  { icon: Puzzle, title: "Sponsor autism family support", body: "Fund resource navigation, sensory-aware planning, or specialized supports for a family raising an autistic child." },
  { icon: ShoppingBasket, title: "Sponsor essentials", body: "Support documentation, transportation, school supplies, or urgent basics that keep a household steady." },
];

function SponsorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Sponsor a Family"
          title="Sponsor a household. Stabilize a future."
          description="For donors, churches, businesses, and community groups ready to back a specific area of family stabilization with dignity and discretion."
        />
        <CardGrid items={categories} columns={2} />
        <CalloutNote>
          Sponsor pathways are being prepared. LuxeNova Community Wellness, Inc.
          will protect family privacy at every step — sponsors receive
          documented impact updates without identifying details. Reach out
          to be matched with a sponsorship opportunity as our intake opens.
        </CalloutNote>
        <ContentSection>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
            >
              Talk to our team <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground/30"
            >
              See giving options
            </Link>
          </div>
        </ContentSection>
      </main>
      <Footer />
    </div>
  );
}
