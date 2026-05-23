import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, CalloutNote } from "@/components/site/ContentPage";
import { Home, Zap, Puzzle, Compass, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/how-funds-are-used")({
  head: () => ({
    meta: [
      { title: "How Funds Are Used — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "How LuxeNova Community Wellness uses donated funds — emergency housing stabilization, utility relief, autism family support, navigation, and household stabilization barriers.",
      },
      { property: "og:title", content: "How Funds Are Used — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content: "Where donations go and how stabilization decisions are made.",
      },
    ],
  }),
  component: FundsPage,
});

const uses = [
  { icon: Home, title: "Emergency housing stabilization", body: "Documented rent emergencies, late notices, and households at imminent risk of losing their housing." },
  { icon: Zap, title: "Utility relief", body: "Gas, electric, and water shutoff prevention so essential services stay on for the family." },
  { icon: Puzzle, title: "Autism family support", body: "Resource navigation, IEP/DDS/EI coordination, and respite-aware planning for families raising autistic children." },
  { icon: Compass, title: "Navigation and documentation", body: "Help gathering, completing, and submitting the paperwork that benefits, programs, and partners require." },
  { icon: LifeBuoy, title: "Urgent household stabilization barriers", body: "Transportation, school-related needs, and the practical obstacles that keep a household from steadying itself." },
];

function FundsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="How Funds Are Used"
          title="Where every dollar goes."
          description="Donated funds may be used across five core areas of family stabilization. Allocation is reviewed for each request based on documentation, urgency, and available capacity."
        />
        <CardGrid items={uses} columns={3} />
        <CalloutNote>
          Support is not guaranteed. Each request is reviewed based on
          available funds, documentation provided, urgency, eligibility
          guidelines, and team review. LuxeNova Community Wellness is not an
          emergency crisis response service. If a household is in immediate
          danger, please call 911 or local emergency services.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
