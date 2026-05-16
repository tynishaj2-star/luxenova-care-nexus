import { createFileRoute, Link } from "@tanstack/react-router";
import { Intake } from "@/components/site/Intake";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/referral")({
  head: () => ({
    meta: [
      { title: "Submit a Referral — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Securely submit a referral or request services from LuxeNova Community Wellness. A coordinator responds within one business day.",
      },
    ],
  }),
  component: ReferralPage,
});

function ReferralPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-16 md:pt-24">
          <div className="pointer-events-none absolute inset-0 bg-gradient-warm" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.2em] text-rosewood hover:opacity-80"
            >
              ← Back to home
            </Link>
            <h1 className="mt-4 font-display text-5xl text-balance md:text-6xl">
              Submit a referral or request services.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
              Whether you're a family seeking support or a partner organization
              referring a client, this is the secure starting point.
            </p>
          </div>
        </section>
        <Intake />
      </main>
      <Footer />
    </div>
  );
}
