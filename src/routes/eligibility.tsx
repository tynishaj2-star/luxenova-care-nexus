import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, CalloutNote } from "@/components/site/ContentPage";
import { MapPin, Home, Zap, Puzzle, FileText, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Eligibility focus for LuxeNova Community Wellness — Massachusetts families facing housing, utility, autism support, documentation, and urgent stabilization needs.",
      },
      { property: "og:title", content: "Eligibility — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content: "Who LuxeNova can support and how requests are reviewed.",
      },
    ],
  }),
  component: EligibilityPage,
});

const focus = [
  { icon: MapPin, title: "Massachusetts families", body: "Households living in or being served within Massachusetts." },
  { icon: Home, title: "Housing instability", body: "Late notices, rent emergencies, or imminent risk of losing housing." },
  { icon: Zap, title: "Utility shutoff risk", body: "Gas, electric, or water disconnection notices or active shutoff risk." },
  { icon: Puzzle, title: "Autism family support needs", body: "Households raising autistic children or children with special needs who need navigation or resource support." },
  { icon: FileText, title: "Documentation barriers", body: "Families struggling to complete intake forms, applications, or recertifications for benefits and services." },
  { icon: LifeBuoy, title: "Urgent stabilization needs", body: "Transportation, school-related, or practical barriers preventing a household from steadying itself." },
];

function EligibilityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Eligibility"
          title="Who LuxeNova supports."
          description="Eligibility focus areas guide how each Emergency Stabilization Request is reviewed."
        />
        <CardGrid items={focus} columns={3} />
        <CalloutNote>
          LuxeNova Community Wellness is not an emergency crisis response
          service and cannot guarantee funds, approval, or immediate
          intervention. If there is immediate danger, call 911 or local
          emergency services.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
