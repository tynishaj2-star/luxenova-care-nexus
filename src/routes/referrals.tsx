import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ReferralForm } from "@/components/site/ReferralForm";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Request Help — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Submit a confidential Emergency Stabilization Request to LuxeNova Community Wellness. Our team reviews each request and follows up regarding next steps.",
      },
    ],
  }),
  component: RequestHelpPage,
});

function RequestHelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Request Help"
          title="Emergency Stabilization Request"
          description="Tell us what's happening in the household. Our team will review the request and follow up with next steps and available community support."
        />
        <ReferralForm />
      </main>
      <Footer />
    </div>
  );
}
