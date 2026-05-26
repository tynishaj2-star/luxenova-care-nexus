import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ContentSection, CardGrid, CalloutNote } from "@/components/site/ContentPage";
import {
  ShieldCheck,
  Gavel,
  Scale,
  ClipboardCheck,
  Users,
  Wallet,
  FileSignature,
} from "lucide-react";

export const Route = createFileRoute("/conflict-of-interest")({
  head: () => ({
    meta: [
      { title: "Conflict of Interest Policy — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Conflict of Interest Policy and annual disclosure procedures for the directors, officers, and key personnel of LuxeNova Community Wellness.",
      },
      {
        property: "og:title",
        content: "Conflict of Interest Policy — LuxeNova Community Wellness",
      },
      {
        property: "og:description",
        content:
          "How LuxeNova Community Wellness identifies, discloses, and manages conflicts of interest.",
      },
    ],
  }),
  component: ConflictOfInterestPage,
});

const whoIsCovered = [
  {
    icon: Users,
    title: "Directors",
    body: "All members of the Board of Directors of LuxeNova Community Wellness.",
  },
  {
    icon: ShieldCheck,
    title: "Officers",
    body: "Board Chair, Vice Chair, Treasurer, Secretary, and any additional officer roles created by the Board.",
  },
  {
    icon: ClipboardCheck,
    title: "Key Personnel",
    body: "Employees, contractors, and committee members with authority over finances, programs, vendors, or family services.",
  },
];

const whatIsConflict = [
  {
    icon: Wallet,
    title: "Financial interest",
    body: "Ownership, employment, or compensation arrangement with any party that does business with the Corporation, or with a competing nonprofit.",
  },
  {
    icon: Users,
    title: "Family interest",
    body: "Spouse, partner, parent, child, sibling, or household member who has a financial interest in, or stands to benefit from, a transaction or decision.",
  },
  {
    icon: Gavel,
    title: "Governance interest",
    body: "Service as a board member, officer, or paid advisor of an organization with overlapping mission, vendors, or funding sources.",
  },
  {
    icon: ShieldCheck,
    title: "Program interest",
    body: "Personal, family, or household benefit from a family support request, sponsor placement, or program decision under Board or staff review.",
  },
];

const procedure = [
  {
    title: "Disclose promptly",
    body: "Any director, officer, or key person who becomes aware of an actual or potential conflict must disclose it in writing to the Board Chair and the Secretary as soon as the matter arises.",
  },
  {
    title: "Recuse from discussion",
    body: "The interested person shall leave the room (or virtual meeting) during deliberation on the matter and shall not participate in discussion, lobbying, or advocacy on the decision.",
  },
  {
    title: "Recuse from voting",
    body: "The interested person shall not vote on the matter. The remaining disinterested directors shall determine, by majority vote, whether to proceed and on what terms.",
  },
  {
    title: "Document everything",
    body: "The disclosure, the recusal, the alternatives considered, and the final decision shall be recorded in the minutes of the meeting and retained as part of the Corporation's official records.",
  },
  {
    title: "Review for fairness",
    body: "Before approving any transaction with an interested party, the Board shall determine in good faith that the transaction is fair, reasonable, and in the best interest of the Corporation, and that comparable arms-length alternatives were considered.",
  },
];

const annualDisclosure = [
  "I have received, read, and understand the Conflict of Interest Policy of LuxeNova Community Wellness.",
  "I agree to comply with the Policy and to disclose actual or potential conflicts as they arise.",
  "I understand that LuxeNova Community Wellness is a charitable, tax-exempt organization and that, to maintain its federal tax exemption, it must engage primarily in activities that accomplish its exempt purposes.",
  "I will not use my position with the Corporation for personal gain, nor will I use confidential information acquired through my role for any purpose other than to advance the mission of the Corporation.",
];

function ConflictOfInterestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Governance Policy"
          title="Conflict of Interest Policy"
          description="How LuxeNova Community Wellness identifies, discloses, and manages conflicts of interest to protect the mission, the families we serve, and the trust of our donors and partners."
        />

        <ContentSection title="Purpose">
          <p>
            This Conflict of Interest Policy is intended to protect the
            charitable interests of LuxeNova Community Wellness (the
            "Corporation") when it considers entering into a transaction or
            arrangement that might benefit the private interest of a director,
            officer, employee, contractor, or family member. This Policy is
            adopted in addition to, and in compliance with, applicable
            Massachusetts nonprofit law and Section 4958 of the Internal
            Revenue Code regarding excess benefit transactions.
          </p>
        </ContentSection>

        <ContentSection title="Who is covered">
          <p>
            This Policy applies to every person with decision-making
            responsibility on behalf of LuxeNova Community Wellness.
          </p>
        </ContentSection>
        <CardGrid items={whoIsCovered} columns={3} />

        <ContentSection title="What counts as a conflict">
          <p>
            A conflict of interest exists when a covered person's personal,
            family, financial, or outside organizational interests could
            reasonably appear to influence — or actually do influence — a
            decision made on behalf of the Corporation.
          </p>
        </ContentSection>
        <CardGrid items={whatIsConflict} columns={2} />

        <ContentSection title="Disclosure and recusal procedure">
          <p>
            When a conflict — actual, potential, or perceived — is identified,
            the following procedure applies.
          </p>
          <ol className="mt-4 space-y-4">
            {procedure.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-rosewood">
                  Step {i + 1}
                </p>
                <p className="mt-1 font-display text-base text-foreground">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </ContentSection>

        <ContentSection title="Compensation matters">
          <p>
            A voting member of the Board who receives, directly or indirectly,
            compensation from the Corporation is precluded from voting on
            matters pertaining to that person's compensation. A voting member
            of any committee whose jurisdiction includes compensation matters
            and who receives compensation from the Corporation is precluded
            from voting on matters pertaining to that person's compensation.
          </p>
        </ContentSection>

        <ContentSection title="Donations from interested persons">
          <p>
            Directors, officers, and key personnel may make personal
            charitable donations to the Corporation. Such donations shall not
            entitle the donor to any preferential treatment, vote, or
            decision-making influence. Restricted gifts from interested
            persons shall be reviewed by the disinterested members of the
            Board to confirm alignment with the Corporation's mission.
          </p>
        </ContentSection>

        <ContentSection title="Confidentiality">
          <p>
            Information acquired by directors, officers, and key personnel in
            the course of their service — including family intake details,
            donor information, financial data, and Board deliberations — is
            confidential and shall be used solely for the purpose of advancing
            the mission of the Corporation.
          </p>
        </ContentSection>

        <ContentSection title="Violations">
          <p>
            If the Board has reasonable cause to believe that a covered person
            has failed to disclose an actual or potential conflict, the Board
            shall inform the person of the basis for that belief and provide
            an opportunity to explain. If, after hearing the response and
            making any further investigation as warranted, the Board
            determines that the person has failed to disclose an actual or
            potential conflict, the Board shall take appropriate corrective
            and disciplinary action, up to and including removal from the
            Board or termination of employment or engagement.
          </p>
        </ContentSection>

        <ContentSection title="Annual disclosure">
          <p>
            Each director, officer, and key person shall annually sign a
            disclosure statement affirming the following:
          </p>
          <div className="mt-4 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood">
                <FileSignature className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-rosewood">
                  Annual Disclosure Statement
                </p>
                <p className="font-display text-base">
                  LuxeNova Community Wellness
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {annualDisclosure.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rosewood/40 text-[11px] font-medium text-rosewood">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border/60 pt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                Disclosure of current interests
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                List any business, organization, family relationship, or
                financial interest that could reasonably be considered a
                conflict, or write "None" if none exists.
              </p>
              <div className="mt-3 h-24 rounded-xl border border-dashed border-border bg-background/60" />
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                  Signature
                </p>
                <div className="mt-2 h-10 border-b border-border" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Name (printed)
                </p>
                <div className="mt-1 h-10 border-b border-border" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                  Role
                </p>
                <div className="mt-2 h-10 border-b border-border" />
                <p className="mt-2 text-xs text-muted-foreground">Date</p>
                <div className="mt-1 h-10 border-b border-border" />
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Recordkeeping">
          <p>
            The Secretary shall maintain signed annual disclosure statements
            and records of all conflict disclosures, recusals, and resulting
            Board actions as part of the Corporation's official records.
          </p>
        </ContentSection>

        <section className="pb-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 px-6 sm:flex-row">
            <Link
              to="/bylaws"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition hover:border-rosewood/40 hover:text-rosewood"
            >
              ← View Bylaws
            </Link>
            <Link
              to="/governance"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-rosewood px-7 text-sm font-medium text-rosewood-foreground shadow-soft transition hover:opacity-95"
            >
              Governance Overview
            </Link>
            <Link
              to="/board"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition hover:border-rosewood/40 hover:text-rosewood"
            >
              Board of Directors
            </Link>
          </div>
        </section>

        <CalloutNote>
          This Policy was adopted by the Board of Directors of LuxeNova
          Community Wellness and is reviewed annually. Signed disclosures
          are retained by the Secretary as part of the Corporation's
          official governance records.
        </CalloutNote>

        <div className="mx-auto max-w-5xl px-6 pb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Companion documents
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <Scale className="mr-1 inline h-4 w-4 align-text-bottom text-rosewood" strokeWidth={1.5} />
            Read alongside the{" "}
            <Link to="/bylaws" className="text-rosewood underline-offset-2 hover:underline">
              Bylaws
            </Link>{" "}
            and{" "}
            <Link to="/donation-policy" className="text-rosewood underline-offset-2 hover:underline">
              Donation Policy
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
