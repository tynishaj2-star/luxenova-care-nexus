import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ContentSection, CalloutNote } from "@/components/site/ContentPage";

export const Route = createFileRoute("/donation-policy")({
  head: () => ({
    meta: [
      { title: "Donation Policy — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Donation Policy for LuxeNova Community Wellness, Inc. — purpose of donations, restricted vs general support, no guaranteed assistance, refunds, and transparency.",
      },
      { property: "og:title", content: "Donation Policy — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "How donations are accepted, used, and reported.",
      },
    ],
  }),
  component: DonationPolicyPage,
});

function DonationPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Donation Policy"
          title="Clear, honest, and donor-respectful."
          description="This policy explains how donations are accepted, applied, and reported by LuxeNova Community Wellness, Inc."
        />

        <ContentSection title="Purpose of donations">
          <p>
            Donations support emergency stabilization for Massachusetts
            families — including rent assistance, utility relief, autism
            family support, documentation, resource navigation, and
            community outreach.
          </p>
        </ContentSection>

        <ContentSection title="Restricted and general support">
          <p>
            Donors may direct a gift toward a specific program area
            (restricted) or contribute toward overall family stabilization
            (general). When a restricted area is fully funded, additional
            restricted gifts may be redirected to the most urgent
            stabilization need, with donor notification.
          </p>
        </ContentSection>

        <ContentSection title="No guaranteed assistance">
          <p>
            A donation does not guarantee that a specific family or request
            will be funded. Every stabilization decision is reviewed based
            on documentation, urgency, eligibility, and available capacity.
          </p>
        </ContentSection>

        <ContentSection title="Refunds and processing">
          <p>
            Donations are generally non-refundable. If a processing error
            occurs, donors may contact our team to request a review.
            Recurring gifts may be paused or cancelled at any time.
          </p>
        </ContentSection>

        <ContentSection title="Transparency and reporting">
          <p>
            Donations are tracked and reported in aggregate on our Impact
            and Transparency pages. Sponsors and recurring donors may
            receive program-specific updates without identifying family
            information.
          </p>
        </ContentSection>

        <CalloutNote>
          LuxeNova Community Wellness, Inc. does not currently claim 501(c)(3)
          tax-exempt status. Donations should not be assumed tax-deductible
          unless and until formal IRS approval is confirmed on the
          Nonprofit Status page.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
