import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Frequently asked questions about LuxeNova Community Wellness, Inc. — who can request help, eligibility, referrals, documents, sponsorship, and nonprofit status.",
      },
      { property: "og:title", content: "FAQ — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "Answers about requests, eligibility, sponsorship, and status.",
      },
    ],
  }),
  component: FAQPage,
});

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Who can request help?",
    a: (
      <>
        Massachusetts families facing housing instability, utility shutoff
        risk, autism-related support gaps, documentation barriers, or other
        urgent stabilization needs. Requests can come from the family
        directly or from a trusted source — provider, school, faith group,
        shelter, or community agency.
      </>
    ),
  },
  {
    q: "Is assistance guaranteed?",
    a: (
      <>
        No. Every request is reviewed based on documentation, urgency,
        eligibility, and available capacity. LuxeNova is not an emergency
        crisis response service. If a household is in immediate danger,
        please call 911 or local emergency services.
      </>
    ),
  },
  {
    q: "Can providers, schools, churches, or agencies refer families?",
    a: (
      <>
        Yes. Partner referrals are welcome through the{" "}
        <Link to="/referrals" className="text-rosewood underline-offset-4 hover:underline">
          Emergency Stabilization Request
        </Link>{" "}
        form. The form captures the request source so we can follow up
        with the referring partner.
      </>
    ),
  },
  {
    q: "What documents may be needed?",
    a: (
      <>
        Depending on the request, helpful documents include rent notices
        or leases, utility bills or shutoff notices, autism support
        documents, income or benefit documents, and any school or agency
        letters relevant to the request.
      </>
    ),
  },
  {
    q: "Can donors sponsor a family directly?",
    a: (
      <>
        Yes — through our{" "}
        <Link to="/sponsor-a-family" className="text-rosewood underline-offset-4 hover:underline">
          Sponsor a Family
        </Link>{" "}
        program. Sponsorship pathways protect family privacy while keeping
        the sponsor informed about documented impact.
      </>
    ),
  },
  {
    q: "Is LuxeNova already a 501(c)(3)?",
    a: (
      <>
        Tax-exempt status is being structured. Please review the{" "}
        <Link to="/nonprofit-status" className="text-rosewood underline-offset-4 hover:underline">
          Nonprofit Status
        </Link>{" "}
        page before assuming donations are tax-deductible.
      </>
    ),
  },
];

function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="FAQ"
          title="Common questions, clear answers."
          description="If you don't see what you're looking for, please reach out through our Contact page."
        />
        <section className="pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition hover:border-rosewood/30"
                >
                  <summary className="cursor-pointer list-none font-display text-lg text-foreground marker:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {f.q}
                      <span className="mt-1 text-rosewood transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
