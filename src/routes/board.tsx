import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, CalloutNote } from "@/components/site/ContentPage";
import { Users, Wallet, Handshake, ClipboardCheck, ShieldAlert, Scale } from "lucide-react";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "Board — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Board and governance for LuxeNova Community Wellness — community accountability, financial oversight, partnership development, impact review, and responsible use of funds.",
      },
      { property: "og:title", content: "Board — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content: "Governance structure and board formation.",
      },
    ],
  }),
  component: BoardPage,
});

const pillars = [
  { icon: Users, title: "Community accountability", body: "Board members represent the communities we serve and hold the initiative answerable to them." },
  { icon: Wallet, title: "Financial oversight", body: "Independent review of how donations are received, allocated, and reported." },
  { icon: Handshake, title: "Partnership development", body: "Stewardship of relationships with faith groups, schools, housing partners, and sponsors." },
  { icon: ClipboardCheck, title: "Program impact review", body: "Periodic review of program outcomes, eligibility decisions, and stabilization indicators." },
  { icon: ShieldAlert, title: "Conflicts of interest", body: "A documented policy for declaring and managing personal, financial, or organizational conflicts." },
  { icon: Scale, title: "Responsible use of funds", body: "Boundaries on how donated funds are used and how restricted gifts are honored." },
];

function BoardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Board"
          title="Governance built for trust."
          description="The board structure for LuxeNova Community Wellness is being formed around six core responsibilities."
        />
        <CardGrid items={pillars} columns={3} />
        <CalloutNote>
          Board seats are being structured as the initiative formalizes.
          Community members, partners, and professionals interested in
          board service may reach out through our Contact page. Final
          appointments will be published here.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
