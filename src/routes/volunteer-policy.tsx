import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid } from "@/components/site/ContentPage";
import { Lock, ListChecks, Ban, HeartHandshake, BadgeCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/volunteer-policy")({
  head: () => ({
    meta: [
      { title: "Volunteer Policy — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Volunteer expectations for LuxeNova Community Wellness, Inc. — respect family privacy, follow assigned roles, dignity, screening, and reporting.",
      },
      { property: "og:title", content: "Volunteer Policy — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "What we ask of every LuxeNova volunteer.",
      },
    ],
  }),
  component: VolunteerPolicyPage,
});

const expectations = [
  { icon: Lock, title: "Respect family privacy", body: "Household details shared during outreach, intake, or coordination are confidential and never discussed outside assigned channels." },
  { icon: ListChecks, title: "Follow assigned roles", body: "Volunteers operate within the role and scope they are oriented to — no improvised assistance or freelance decisions." },
  { icon: Ban, title: "Do not promise funds or services", body: "Only authorized team members may commit funds, sponsorships, or program services to a family." },
  { icon: HeartHandshake, title: "Treat families and partners with dignity", body: "Composed, respectful, judgment-free communication is non-negotiable in every interaction." },
  { icon: BadgeCheck, title: "Complete screening and orientation", body: "Screening, references, and orientation may be required depending on the volunteer role." },
  { icon: AlertTriangle, title: "Report concerns or conflicts", body: "Safety concerns, conflicts of interest, or policy issues must be reported promptly to the coordinating team." },
];

function VolunteerPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Volunteer Policy"
          title="What we ask of every volunteer."
          description="Six expectations every LuxeNova volunteer agrees to before serving alongside families and partners."
        />
        <CardGrid items={expectations} columns={3} />
      </main>
      <Footer />
    </div>
  );
}
