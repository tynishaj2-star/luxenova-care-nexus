import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Privacy Policy for LuxeNova Community Wellness, including SMS consent, HIPAA-aligned practices, and document upload security.",
      },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "Information We Collect",
    body:
      "We collect information you provide when submitting referrals, contact forms, applications, or newsletter sign-ups. This may include name, contact information, demographic details, insurance information, referral details, and any documents you upload.",
  },
  {
    title: "How Information Is Used",
    body:
      "Information is used to review referrals, coordinate care, respond to inquiries, evaluate employment applications, and support client services. Information is shared only with team members and partners involved in providing services, and only as permitted by law.",
  },
  {
    title: "Communication by Phone, Email, and Text",
    body:
      "We may contact you by phone, email, or text regarding your referral, inquiry, or services. Standard rates may apply for phone calls and text messages.",
  },
  {
    title: "SMS Consent",
    body:
      "By submitting a form or providing your mobile number, you consent to receive text messages from LuxeNova Community Wellness related to your referral or service request. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties. Message frequency may vary. Message and data rates may apply. You may opt out of text messages at any time by replying STOP.",
  },
  {
    title: "HIPAA & Confidentiality",
    body:
      "LuxeNova Community Wellness follows HIPAA-aligned practices for handling protected health information. Information is treated as confidential and is accessed only by authorized team members for purposes of treatment, payment, or operations.",
  },
  {
    title: "Document Upload Security",
    body:
      "Documents uploaded through our referral portal are transmitted over encrypted connections and stored using secure access controls. Only authorized personnel involved in reviewing the referral may access uploaded documents.",
  },
  {
    title: "Contact Information",
    body:
      "Questions about this Privacy Policy can be directed to contact information that will be added before launch.",
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          description="How LuxeNova Community Wellness collects, uses, and safeguards the information you provide."
        />
        <section className="pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-soft md:p-12">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Last updated · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <div className="mt-10 space-y-10">
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
