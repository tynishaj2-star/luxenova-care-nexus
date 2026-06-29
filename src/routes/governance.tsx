import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ContentSection, CardGrid, CalloutNote } from "@/components/site/ContentPage";
import {
  Crown,
  Gavel,
  ShieldCheck,
  Scale,
  BookOpenCheck,
  Users,
  Wallet,
  ClipboardList,
} from "lucide-react";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Governance & Bylaws — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Governance framework for LuxeNova Community Wellness, Inc. — board oversight, officer roles, bylaws summary, financial controls, conflict of interest, recordkeeping, and policy development.",
      },
      { property: "og:title", content: "Governance & Bylaws — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content:
          "Transparent governance, board oversight, and financial accountability for LuxeNova Community Wellness, Inc..",
      },
    ],
  }),
  component: GovernancePage,
});

const officers = [
  {
    icon: Crown,
    title: "Founder / President / Treasurer / Director",
    body: "Stewards the founding mission, leads executive direction, oversees financial activity, signs off on disbursement records, and serves as the director of record on state filings.",
  },
  {
    icon: Gavel,
    title: "Board Chair",
    body: "Leads board meetings, sets governance priorities, and represents LuxeNova in formal and partner-facing matters.",
  },
  {
    icon: Users,
    title: "Vice Chair",
    body: "Supports the Board Chair, steps in when needed, and helps coordinate committees and special initiatives.",
  },
  {
    icon: BookOpenCheck,
    title: "Clerk / Secretary / Treasurer Support",
    body: "Maintains official records — minutes, policies, votes, and organizational documents — and assists the Treasurer with donation logging, expense tracking, and financial report preparation.",
  },
  {
    icon: ShieldCheck,
    title: "Community Impact & Program Oversight",
    body: "Monitors program outcomes, family stabilization quality, and equitable, dignified delivery of community relief.",
  },
];

const bylaws = [
  { title: "Organization purpose", body: "The mission, scope, and community LuxeNova exists to serve." },
  { title: "Board size and roles", body: "Minimum and maximum board members, terms, and how seats are filled." },
  { title: "Officer duties", body: "Specific responsibilities for each officer role and how authority is delegated." },
  { title: "Meetings and voting", body: "Meeting cadence, quorum requirements, voting procedures, and remote participation." },
  { title: "Conflicts of interest", body: "How conflicts are disclosed, documented, and resolved." },
  { title: "Financial controls", body: "Authorization, recordkeeping, and review procedures for funds and expenses." },
  { title: "Donation oversight", body: "How donations are received, tracked, restricted, and reported." },
  { title: "Recordkeeping", body: "Retention of minutes, financials, donor records, policies, and impact data." },
  { title: "Committees", body: "Standing and ad-hoc committees for finance, programs, governance, and community impact." },
  { title: "Amendments", body: "Process to amend the bylaws with appropriate board notice and approval." },
  { title: "Dissolution rules", body: "How remaining assets are distributed if the organization ever dissolves, consistent with nonprofit purpose." },
];

const financialControls = [
  { title: "Donations are tracked", body: "Every donation is logged with source, date, amount, and any donor restriction." },
  { title: "Nonprofit funds stay separate", body: "Organizational funds remain entirely separate from any personal account or activity." },
  { title: "Expenses are documented", body: "Disbursements are supported by receipts, requests, or program documentation." },
  { title: "Board reviews financial activity", body: "The board reviews periodic financial summaries for accuracy and mission alignment." },
  { title: "Donor restrictions are honored", body: "When donors restrict a gift to a program area, those funds are applied accordingly when feasible." },
  { title: "Funds support the mission", body: "All disbursements must serve community relief, family stabilization, or related programs." },
];

const records = [
  { title: "Board minutes", body: "Decisions, motions, and outcomes from board meetings." },
  { title: "Financial records", body: "Income, disbursements, and account activity." },
  { title: "Donation records", body: "Donor data, restrictions, and acknowledgment history." },
  { title: "Policies", body: "Approved organizational policies and amendments." },
  { title: "Request documentation", body: "Intake forms, eligibility notes, and stabilization decisions." },
  { title: "Impact reports", body: "Aggregate outcomes and community impact summaries." },
  { title: "Annual filings", body: "Required state and federal filings as applicable." },
];

function GovernancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Governance & Bylaws"
          title="Built on transparency and accountability."
          description="LuxeNova Community Wellness, Inc. is building a transparent governance structure to support responsible community relief, family stabilization, donation oversight, and public accountability."
        />

        <ContentSection title="Governance overview">
          <p>
            LuxeNova Community Wellness, Inc. is structured around board
            oversight, mission accountability, financial stewardship, and
            community-centered decision-making. Governance practices are
            documented, reviewed, and continuously refined so families,
            donors, partners, and funders can trust how the organization
            operates.
          </p>
        </ContentSection>

        <ContentSection title="Board officer roles">
          <p className="text-sm text-muted-foreground">
            Roles below describe the responsibilities each officer carries
            on behalf of the mission and community served.
          </p>
        </ContentSection>
        <CardGrid items={officers} columns={3} />

        <ContentSection title="Bylaws summary">
          <p>
            Bylaws are the internal operating rules for the organization —
            the rulebook that guides decisions, votes, finances, and
            accountability. Below is a plain-language summary of the topics
            covered.
          </p>
        </ContentSection>
        <CardGrid
          items={bylaws.map((b) => ({ ...b, icon: Scale }))}
          columns={3}
        />

        <ContentSection title="Financial controls">
          <p>
            Financial integrity is a non-negotiable foundation for any
            community-serving organization. These controls protect donors,
            families, and the mission itself.
          </p>
        </ContentSection>
        <CardGrid
          items={financialControls.map((f) => ({ ...f, icon: Wallet }))}
          columns={3}
        />

        <ContentSection title="Conflict of interest">
          <p>
            Board members are expected to disclose personal, financial, or
            family conflicts before any decision involving funds, vendors,
            contracts, partnerships, or family support requests. Disclosed
            conflicts are documented and the affected member recuses from
            the related vote or discussion as appropriate.
          </p>
        </ContentSection>

        <ContentSection title="Recordkeeping">
          <p>
            LuxeNova maintains organized, secure records to support
            accountability, continuity, and reporting.
          </p>
        </ContentSection>
        <CardGrid
          items={records.map((r) => ({ ...r, icon: ClipboardList }))}
          columns={3}
        />

        <ContentSection title="Policy development">
          <p>
            LuxeNova will continue developing policies for donations,
            volunteers, privacy, food drives, sponsor support, family
            requests, and community partnerships. Policies are reviewed and
            refined as the organization grows and as community need
            evolves.
          </p>
        </ContentSection>

        <section className="pb-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 px-6 sm:flex-row">
            <Link
              to="/bylaws"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-rosewood px-7 text-sm font-medium text-rosewood-foreground shadow-soft transition hover:opacity-95"
            >
              Read Full Bylaws
            </Link>
            <Link
              to="/conflict-of-interest"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition hover:border-rosewood/40 hover:text-rosewood"
            >
              Conflict of Interest Policy
            </Link>
            <Link
              to="/board"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition hover:border-rosewood/40 hover:text-rosewood"
            >
              View Board
            </Link>
            <Link
              to="/donation-policy"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition hover:border-rosewood/40 hover:text-rosewood"
            >
              Donation Policy
            </Link>
          </div>
        </section>


        <CalloutNote>
          Governance practices are continuously developed. This page
          reflects the current framework guiding LuxeNova Community
          Wellness as it grows toward funder-readiness and formal
          nonprofit recognition.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
