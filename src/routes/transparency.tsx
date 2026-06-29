import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid } from "@/components/site/ContentPage";
import { Receipt, FileSearch, BarChart3, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "Transparency — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "How LuxeNova Community Wellness, Inc. tracks donations, documents requests, reports impact, and protects family privacy — our public trust framework.",
      },
      { property: "og:title", content: "Transparency — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "Donation tracking, request documentation, impact reporting, and responsible privacy.",
      },
    ],
  }),
  component: TransparencyPage,
});

const pillars = [
  { icon: Receipt, title: "Donation tracking", body: "Every gift is recorded and tied to the program area it supports. Donors and sponsors receive clear acknowledgments." },
  { icon: FileSearch, title: "Request documentation", body: "Each Emergency Stabilization Request is reviewed with the documentation provided — rent notices, shutoff letters, support documents, or referral context." },
  { icon: BarChart3, title: "Impact reporting", body: "Outcomes are tracked and published on our Impact page — families supported, relief delivered, referrals completed, shutoffs avoided." },
  { icon: ShieldCheck, title: "Responsible privacy", body: "Family identities are protected. Impact is reported without exposing household details to donors, sponsors, or the public." },
  { icon: Users, title: "Public trust framework", body: "Governance, eligibility, donation policy, and nonprofit status are documented openly so the community can hold this work to a high standard." },
];

function TransparencyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Transparency"
          title="Open by design. Accountable by practice."
          description="LuxeNova Community Wellness, Inc. is built on five commitments that keep donors, partners, and families informed without compromising privacy."
        />
        <CardGrid items={pillars} columns={3} />
      </main>
      <Footer />
    </div>
  );
}
