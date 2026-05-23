import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import {
  ContentSection,
  CardGrid,
  CalloutNote,
} from "@/components/site/ContentPage";
import {
  ScaleIcon,
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  Users,
  FileCheck2,
} from "lucide-react";

export const Route = createFileRoute("/staffing-compensation")({
  head: () => ({
    meta: [
      { title: "Staffing & Compensation — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Internal staffing and compensation policy for LuxeNova Community Wellness — reasonable compensation, board approval, classification, and responsible use of funds.",
      },
      {
        property: "og:title",
        content: "Staffing & Compensation — LuxeNova Community Wellness",
      },
      {
        property: "og:description",
        content:
          "How LuxeNova Community Wellness approaches paid roles, classification, and oversight.",
      },
    ],
  }),
  component: StaffingCompensationPage,
});

const principles = [
  {
    icon: ScaleIcon,
    title: "Reasonable compensation",
    body: "Pay for any role is benchmarked against comparable nonprofits of similar size, mission, and region — and documented in board minutes.",
  },
  {
    icon: ClipboardCheck,
    title: "Board approval",
    body: "All paid positions, salary ranges, and any founder or executive compensation are reviewed and approved by independent board members.",
  },
  {
    icon: Users,
    title: "Correct classification",
    body: "Workers are classified as W-2 employees or 1099 contractors based on actual role and control — never to avoid taxes or benefits.",
  },
  {
    icon: Wallet,
    title: "Responsible use of funds",
    body: "Salaries are paid from unrestricted donations, program revenue, or grants that explicitly allow personnel costs — never from family-aid restricted funds.",
  },
  {
    icon: ShieldCheck,
    title: "Conflicts of interest",
    body: "Founders and related parties cannot vote on their own compensation. All conflicts are disclosed and recorded.",
  },
  {
    icon: FileCheck2,
    title: "Compliance & payroll",
    body: "Federal and state withholding, unemployment, W-2s, and 1099s are handled through a recognized payroll provider with proper tax filings.",
  },
];

function StaffingCompensationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Internal Policy"
          title="Staffing & Compensation."
          description="How LuxeNova Community Wellness approaches paid roles, classification, oversight, and the responsible use of donor and grant funds."
        />

        <ContentSection title="Our commitment">
          <p>
            LuxeNova Community Wellness is built on transparency and
            dignity — for the families we serve and for anyone who works
            on the mission. This policy outlines the principles that
            guide how we structure paid roles as the organization grows.
          </p>
          <p>
            Until formal nonprofit incorporation and 501(c)(3)
            recognition are confirmed, all staffing decisions are made
            with the future structure in mind: reasonable pay, board
            approval, and full separation between operating funds and
            funds restricted for direct family assistance.
          </p>
        </ContentSection>

        <CardGrid items={principles} columns={3} />

        <ContentSection title="How a paid role is created">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              The board reviews the need for the role, the proposed
              scope, and the funding source.
            </li>
            <li>
              A salary range is set using comparable nonprofit
              compensation data and documented in board minutes.
            </li>
            <li>
              The role is classified correctly as W-2 employee or 1099
              contractor based on the actual working relationship.
            </li>
            <li>
              Independent board members approve the role and
              compensation — the founder does not vote on founder pay.
            </li>
            <li>
              Payroll is processed through a recognized provider that
              handles tax withholding, filings, and year-end W-2s or
              1099s.
            </li>
            <li>
              Compensation totals are included in annual transparency
              reporting.
            </li>
          </ol>
        </ContentSection>

        <CalloutNote>
          This is an internal-facing policy published for transparency.
          Specific salaries, hires, and contractor agreements are
          confidential and shared only with the board and, where
          required, with funders and regulators.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
