import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ContentSection } from "@/components/site/ContentPage";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "Founder — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "The founder vision behind LuxeNova Community Wellness, Inc. — a Massachusetts community relief and family stabilization initiative shaped by lived awareness and practical problem-solving.",
      },
      { property: "og:title", content: "Founder — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "Why LuxeNova exists and the values guiding it.",
      },
    ],
  }),
  component: FounderPage,
});

function FounderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Founder"
          title="Built from the community it serves."
          description="LuxeNova Community Wellness, Inc. is being shaped from lived community awareness, practical problem-solving, and a belief that emergency support should be organized, respectful, and transparent."
        />
        <ContentSection title="Why LuxeNova exists">
          <p>
            Too many Massachusetts families face the same pattern: a rent
            shortfall, a utility shutoff notice, an unanswered question
            about autism support, or a documentation barrier — and the help
            they need is scattered across systems that are difficult to
            navigate under stress.
          </p>
          <p>
            LuxeNova was started to organize that response. To meet families
            with composure instead of confusion. To document what is
            happening so the right resources reach the right households,
            quickly, and with dignity intact.
          </p>
        </ContentSection>
        <ContentSection title="What we believe">
          <p>
            Emergency support should never feel transactional. It should be
            calm, prepared, and respectful — closer to how a family would
            treat its own than how a queue treats a number.
          </p>
          <p>
            Transparency is not a marketing line — it is a discipline.
            Donors, sponsors, partners, and the families we serve all
            deserve clarity about how decisions are made and how funds are
            used.
          </p>
          <p>
            Communities know themselves best. The role of this initiative
            is to bring structure, follow-through, and accountability to
            work that the community is already doing.
          </p>
        </ContentSection>
        <ContentSection>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
            >
              Connect with the founder <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground/30"
            >
              Read the mission
            </Link>
          </div>
        </ContentSection>
      </main>
      <Footer />
    </div>
  );
}
