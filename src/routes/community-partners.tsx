import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, ContentSection } from "@/components/site/ContentPage";
import { Church, Store, Building2, GraduationCap, Users, HandCoins, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/community-partners")({
  head: () => ({
    meta: [
      { title: "Community Partners — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Partner with LuxeNova Community Wellness, Inc. — faith communities, local businesses, housing partners, schools, community organizations, sponsors, and donors.",
      },
      { property: "og:title", content: "Community Partners — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content: "Partnership pathways for organizations standing alongside Massachusetts families.",
      },
    ],
  }),
  component: PartnersPage,
});

const partners = [
  { icon: Church, title: "Faith communities", body: "Churches, mosques, temples, and faith-based groups standing with neighbors in need." },
  { icon: Store, title: "Local businesses", body: "Small and mid-size Massachusetts businesses underwriting stabilization and sponsorships." },
  { icon: Building2, title: "Housing partners", body: "Landlords, property managers, and housing organizations coordinating on rent emergencies." },
  { icon: GraduationCap, title: "Schools and family programs", body: "Schools, EI providers, family resource centers, and youth programs referring families." },
  { icon: Users, title: "Community organizations", body: "Nonprofits and grassroots groups already trusted in the neighborhoods we serve." },
  { icon: HandCoins, title: "Sponsors and donors", body: "Individuals, families, and foundations sponsoring specific stabilization areas." },
];

const pathways = [
  "Sponsor a family stabilization request",
  "Host a fundraiser",
  "Refer families",
  "Share verified resources",
  "Support autism family resource navigation",
  "Partner on donation drives",
];

function PartnersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Community Partners"
          title="Stronger together. By design."
          description="LuxeNova Community Wellness, Inc. partners with the people and organizations already trusted in the communities we serve."
        />
        <CardGrid items={partners} columns={3} />
        <ContentSection title="Partnership pathways">
          <ul className="grid gap-3 sm:grid-cols-2">
            {pathways.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rosewood" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
            >
              Start a partnership conversation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </ContentSection>
      </main>
      <Footer />
    </div>
  );
}
