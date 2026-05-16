import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Terms of Service for the LuxeNova Community Wellness website and referral portal.",
      },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Acceptance of Terms",
    body:
      "By accessing or using the LuxeNova Community Wellness website, referral portal, or related services, you agree to be bound by these Terms of Service.",
  },
  {
    title: "Use of Website",
    body:
      "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict the use of this site by, any third party.",
  },
  {
    title: "Referrals & Submissions",
    body:
      "Submitting a referral or form does not create a client relationship or guarantee acceptance into services. Acceptance is determined after review by our coordination team.",
  },
  {
    title: "Intellectual Property",
    body:
      "All content on this site, including text, design, and branding, is the property of LuxeNova Community Wellness and may not be reproduced without permission.",
  },
  {
    title: "Disclaimer",
    body:
      "Information provided on this site is for general informational purposes and does not constitute medical, legal, or professional advice.",
  },
  {
    title: "Changes",
    body:
      "We may update these Terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.",
  },
];

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Legal"
          title="Terms of Service"
          description="The terms that govern your use of LuxeNova Community Wellness digital services."
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
