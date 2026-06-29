import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, CalloutNote } from "@/components/site/ContentPage";
import { Rocket, HandCoins, Users, TrendingUp, Handshake, UserPlus } from "lucide-react";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Updates — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Updates from LuxeNova Community Wellness, Inc. — launch updates, donation drives, community needs, impact milestones, partner announcements, and volunteer calls.",
      },
      { property: "og:title", content: "Updates — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "What's happening across the LuxeNova initiative.",
      },
    ],
  }),
  component: UpdatesPage,
});

const streams = [
  { icon: Rocket, title: "Launch updates", body: "Milestones as the initiative is built out — program rollouts, intake openings, and partner onboarding." },
  { icon: HandCoins, title: "Donation drives", body: "Active and upcoming giving campaigns supporting specific stabilization areas." },
  { icon: Users, title: "Community needs", body: "Where households across Massachusetts are most under pressure right now." },
  { icon: TrendingUp, title: "Impact milestones", body: "Documented outcomes from completed stabilization work." },
  { icon: Handshake, title: "Partner announcements", body: "New community, faith, school, business, and housing partnerships." },
  { icon: UserPlus, title: "Volunteer calls", body: "Volunteer roles open for outreach, intake support, and community events." },
];

function UpdatesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Updates"
          title="What's happening at LuxeNova."
          description="Six streams of updates that keep donors, partners, and the community informed."
        />
        <CardGrid items={streams} columns={3} />
        <CalloutNote>
          Updates will be posted here as the initiative grows. To receive
          announcements directly, reach out through our Contact page and
          ask to be added to the community list.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
