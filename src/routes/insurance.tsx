import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ShieldCheck, FileText, ClipboardCheck, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance & Service Access — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Insurance information, MassHealth readiness, referral review process, and eligibility questions for LuxeNova Community Wellness.",
      },
      { property: "og:title", content: "Insurance & Service Access" },
      {
        property: "og:description",
        content:
          "Preparing to support clients through eligible insurance programs and referral partnerships.",
      },
    ],
  }),
  component: InsurancePage,
});

const blocks = [
  {
    icon: ShieldCheck,
    title: "Insurance Information",
    body:
      "We are actively building relationships with payors and community-based programs to expand client access. Eligibility and accepted plans will be confirmed during the referral review.",
  },
  {
    icon: FileText,
    title: "MassHealth Readiness",
    body:
      "LuxeNova Community Wellness is preparing for participation in MassHealth-aligned community support programs as we grow our service infrastructure across Massachusetts.",
  },
  {
    icon: ClipboardCheck,
    title: "Referral Review Process",
    body:
      "Every referral is reviewed by a member of our coordination team. We confirm needs, available services, and the right next step — whether direct support, partner referral, or resource navigation.",
  },
  {
    icon: HelpCircle,
    title: "Questions About Eligibility",
    body:
      "Not sure if a client qualifies? Reach out before submitting a referral and our team will help determine the best pathway forward.",
  },
];

function InsurancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Insurance & Access"
          title="Insurance & Service Access"
          description="LuxeNova Community Wellness is preparing to support clients through eligible insurance programs, referral partnerships, and community-based service coordination."
        />
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 md:grid-cols-2">
              {blocks.map((b) => (
                <article
                  key={b.title}
                  className="rounded-3xl border border-border/70 bg-card p-8 shadow-soft"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-rosewood">
                    <b.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h2 className="mt-6 font-display text-2xl">{b.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full bg-gradient-rosewood px-7 py-3.5 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
