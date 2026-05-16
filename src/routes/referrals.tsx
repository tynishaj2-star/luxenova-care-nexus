import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ReferralForm } from "@/components/site/ReferralForm";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Submit a Referral — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Securely submit a referral to LuxeNova Community Wellness. A coordinator reviews each referral and follows up regarding next steps.",
      },
    ],
  }),
  component: ReferralsPage,
});

function ReferralsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Referral Portal"
          title="Submit a Referral"
          description="Please complete the referral form below so our team can review the client's needs and determine appropriate next steps."
        />
        <ReferralForm />
      </main>
      <Footer />
    </div>
  );
}
