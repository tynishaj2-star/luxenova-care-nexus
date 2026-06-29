import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, CalloutNote } from "@/components/site/ContentPage";
import { Home, Zap, Puzzle, FileText } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resource Hub — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "LuxeNova Resource Hub for Massachusetts families — housing, utility, autism family support, and documentation resources.",
      },
      { property: "og:title", content: "Resource Hub — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "Verified Massachusetts resources for families in need.",
      },
    ],
  }),
  component: ResourcesPage,
});

const categories = [
  { icon: Home, title: "Housing resources", body: "Rental assistance programs, eviction prevention support, and housing stabilization services across Massachusetts." },
  { icon: Zap, title: "Utility resources", body: "Statewide and regional programs that help prevent gas, electric, and water shutoffs." },
  { icon: Puzzle, title: "Autism family support", body: "Early Intervention, IEP advocacy, DDS resources, respite supports, and autism-affirming providers." },
  { icon: FileText, title: "Documents to gather", body: "Common documents that speed up benefit applications, recertifications, and stabilization requests." },
];

function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Resource Hub"
          title="A trusted starting point."
          description="A curated set of Massachusetts resources to help families navigate housing, utilities, autism support, and documentation."
        />
        <CardGrid items={categories} columns={2} />
        <CalloutNote>
          Verified Massachusetts resource links are being reviewed and will
          be added here. In the meantime, use the Request Help form for a
          guided response from our team.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
