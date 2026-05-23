import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/hipaa")({
  head: () => ({
    meta: [
      { title: "Confidentiality Notice — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Confidentiality Notice describing how LuxeNova Community Wellness handles family information, support requests, and household documents.",
      },
    ],
  }),
  component: ConfidentialityPage,
});

const sections = [
  {
    title: "Our Commitment to Confidentiality",
    body:
      "LuxeNova Community Wellness treats every family's information as confidential. Support requests, household details, donation inquiries, volunteer interest, partner communications, and uploaded household documents are handled with care and respect.",
  },
  {
    title: "What We Collect",
    body:
      "We collect only what's needed to coordinate relief: family contact details, household composition, the barrier being faced, requested support, and supporting documents you choose to upload.",
  },
  {
    title: "How Information Is Used",
    body:
      "Information is used to review stabilization requests, coordinate community support, communicate with the family or submitter, and report aggregate impact. It is not sold or shared for marketing.",
  },
  {
    title: "Who Can Access It",
    body:
      "Only authorized LuxeNova staff and navigators directly involved in coordinating a family's support may access household information. Coordination with trusted partners only occurs when relevant and respectful of the family's needs.",
  },
  {
    title: "Document Handling",
    body:
      "Documents you upload — rent notices, utility bills, autism support documents, and supporting letters — are transmitted over encrypted connections and stored with secure access controls.",
  },
  {
    title: "Your Rights",
    body:
      "You may request that we update or remove your information at any time by contacting our team.",
  },
  {
    title: "Contact",
    body:
      "For questions about this Confidentiality Notice, contact information will be added before launch.",
  },
];

function ConfidentialityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Legal"
          title="Confidentiality Notice"
          description="How LuxeNova Community Wellness handles family information, support requests, and household documents."
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
