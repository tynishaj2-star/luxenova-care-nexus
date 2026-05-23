import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CardGrid, CalloutNote } from "@/components/site/ContentPage";
import {
  Users,
  Wallet,
  Handshake,
  ClipboardCheck,
  ShieldAlert,
  Scale,
  HeartHandshake,
  Megaphone,
  FileCheck2,
} from "lucide-react";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "Board — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Founding board of LuxeNova Community Wellness — leadership, governance responsibilities, and shared community impact and program oversight.",
      },
      { property: "og:title", content: "Board — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Meet the founding board and review the governance commitments behind LuxeNova Community Wellness.",
      },
    ],
  }),
  component: BoardPage,
});

const boardMembers = [
  {
    name: "Tynisha Johnson",
    role: "Founder / Treasurer / Community Impact & Program Oversight",
    summary:
      "Mission leadership, financial stewardship, donation tracking, organizational formation, and community impact review.",
  },
  {
    name: "Trina Everett",
    role: "Co-Founder / Treasurer / Community Impact & Program Oversight",
    summary:
      "Mission leadership, financial stewardship, donation tracking, organizational formation, and community impact review.",
  },
  {
    name: "Victoria Roscoe",
    role: "Board Chair / President",
    summary:
      "Board leadership, meeting oversight, mission accountability, and governance direction.",
  },
  {
    name: "Latoia Moses",
    role: "Vice Chair / Community Impact & Program Oversight",
    summary:
      "Board support, program review, family stabilization priorities, and community impact guidance.",
  },
  {
    name: "Joe Younge",
    role: "Secretary",
    summary:
      "Meeting records, official documents, board minutes, policy tracking, and compliance organization.",
  },
];




const responsibilities = [
  { icon: ShieldAlert, title: "Protecting the mission", body: "Safeguarding the purpose, values, and community focus of LuxeNova Community Wellness." },
  { icon: Wallet, title: "Reviewing finances and donation use", body: "Independent review of how funds are received, allocated, and reported to the community." },
  { icon: Scale, title: "Conflicts of interest", body: "A documented policy for declaring and managing personal, financial, or organizational conflicts." },
  { icon: Users, title: "Public accountability", body: "Answering to the families and partners we serve through transparent communication and reporting." },
  { icon: Handshake, title: "Fundraising and partnerships", body: "Stewardship of relationships with sponsors, faith groups, schools, and housing partners." },
  { icon: FileCheck2, title: "Compliance readiness", body: "Preparing policies, filings, and records that meet nonprofit and donor expectations." },
  { icon: HeartHandshake, title: "Community trust", body: "Building consistent, respectful, and dignified relationships with the families served." },
  { icon: ClipboardCheck, title: "Documented impact", body: "Tracking outcomes, stabilization indicators, and stories of program impact over time." },
];

function BoardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Board"
          title="Our founding board."
          description="The founding board of LuxeNova Community Wellness — leading mission, governance, finance, and community impact with shared accountability."
        />

        {/* Founding board members */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {boardMembers.map((m) => (
                <article
                  key={m.name}
                  className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-rosewood/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-rosewood/80">
                    Founding Board
                  </p>
                  <h3 className="mt-3 font-display text-2xl">{m.name}</h3>
                  <p className="mt-2 text-sm font-medium text-foreground/80">
                    {m.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {m.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Founding board statement */}
        <section className="pb-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-3xl border border-rosewood/25 bg-accent/40 p-8 shadow-soft md:p-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-rosewood">
                Founding Board
              </p>
              <p className="mt-5 max-w-3xl text-foreground/85 leading-relaxed md:text-lg">
                The founding board supports mission accountability,
                responsible growth, donation oversight, family-centered
                decision-making, and the formation of LuxeNova Community
                Wellness's nonprofit governance structure.
              </p>
            </div>
          </div>
        </section>


        {/* Board responsibilities */}
        <section className="pb-4">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-rosewood">
                Governance
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                Board responsibilities.
              </h2>
            </div>
          </div>
        </section>
        <CardGrid items={responsibilities} columns={4} />

        <CalloutNote>
          The founding board is actively forming policies, filings, and
          partnerships. Community members, partners, and professionals
          interested in supporting board work or program oversight can
          reach out through our Contact page.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
