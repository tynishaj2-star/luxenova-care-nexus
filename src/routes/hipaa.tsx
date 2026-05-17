import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/hipaa")({
  head: () => ({
    meta: [
      { title: "HIPAA Notice — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "HIPAA Notice of Privacy Practices for LuxeNova Community Wellness.",
      },
    ],
  }),
  component: HipaaPage,
});

const sections = [
  {
    title: "Our Commitment to Privacy",
    body:
      "LuxeNova Community Wellness is committed to protecting the privacy of protected health information (PHI) in alignment with the Health Insurance Portability and Accountability Act (HIPAA).",
  },
  {
    title: "Uses & Disclosures",
    body:
      "PHI may be used or disclosed for treatment, payment, or operations, and where required or permitted by law. We will obtain written authorization for uses outside these categories.",
  },
  {
    title: "Your Rights",
    body:
      "You have the right to request access to your information, request corrections, request restrictions on certain uses, and receive an accounting of disclosures. Requests can be submitted in writing to our team.",
  },
  {
    title: "Safeguards",
    body:
      "We use administrative, physical, and technical safeguards to protect PHI, including secure portals, access controls, and staff training.",
  },
  {
    title: "Complaints",
    body:
      "If you believe your privacy rights have been violated, you may file a complaint with LuxeNova Community Wellness or with the U.S. Department of Health and Human Services. We will not retaliate against you for filing a complaint.",
  },
  {
    title: "Contact",
    body:
      "For questions about this notice, contact information will be added before launch.",
  },
];

function HipaaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Legal"
          title="HIPAA Notice"
          description="Notice of Privacy Practices for protected health information."
        />
        <section className="pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-soft md:p-12">
              <div className="space-y-10">
                {sections.map((s) => (
                  <div key={s.title}>
                    <h2 className="font-display text-2xl">{s.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
