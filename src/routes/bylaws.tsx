import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CalloutNote } from "@/components/site/ContentPage";
import { ScrollText } from "lucide-react";

export const Route = createFileRoute("/bylaws")({
  head: () => ({
    meta: [
      { title: "Bylaws — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Adopted bylaws of LuxeNova Community Wellness, Inc., a Massachusetts nonprofit corporation — purpose, board structure, officers, meetings, finances, conflicts, indemnification, amendments, and dissolution.",
      },
      { property: "og:title", content: "Bylaws — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content:
          "Full adopted bylaws governing LuxeNova Community Wellness, Inc..",
      },
    ],
  }),
  component: BylawsPage,
});

type Section = {
  num: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

type Article = {
  num: string;
  title: string;
  sections: Section[];
};

const articles: Article[] = [
  {
    num: "I",
    title: "Name, Office, and Purpose",
    sections: [
      {
        num: "1.1",
        title: "Name",
        paragraphs: [
          'The name of the corporation is "LuxeNova Community Wellness, Inc.," a Massachusetts nonprofit corporation (the "Corporation").',
        ],
      },
      {
        num: "1.2",
        title: "Principal Office",
        paragraphs: [
          "The principal office of the Corporation shall be located in the Commonwealth of Massachusetts at such address as the Board of Directors may designate from time to time.",
        ],
      },
      {
        num: "1.3",
        title: "Purpose",
        paragraphs: [
          "The Corporation is organized exclusively for charitable purposes within the meaning of Section 501(c)(3) of the Internal Revenue Code. Its mission is to stabilize families experiencing crisis through community-centered relief, food access, family navigation, sponsor-a-family programs, and specialized support for households impacted by disability and autism.",
          "No part of the net earnings of the Corporation shall inure to the benefit of any director, officer, or private individual, except as reasonable compensation for services rendered to the Corporation.",
        ],
      },
      {
        num: "1.4",
        title: "Limitations on Activities",
        paragraphs: [
          "Notwithstanding any other provision of these bylaws, the Corporation shall not, except to an insubstantial degree, engage in any activities or exercise any powers that are not in furtherance of the charitable purposes of the Corporation as set forth in Section 1.3.",
          "No substantial part of the activities of the Corporation shall consist of carrying on propaganda or otherwise attempting to influence legislation, and the Corporation shall not participate in, or intervene in (including the publishing or distribution of statements), any political campaign on behalf of, or in opposition to, any candidate for public office.",
          "The Corporation shall not carry on any other activities not permitted to be carried on (a) by an organization exempt from federal income tax under Section 501(c)(3) of the Internal Revenue Code, or (b) by an organization to which contributions are deductible under Section 170(c)(2) of the Internal Revenue Code.",
        ],
      },
    ],
  },
  {
    num: "II",
    title: "Board of Directors",
    sections: [
      {
        num: "2.1",
        title: "General Powers",
        paragraphs: [
          "The affairs of the Corporation shall be managed by its Board of Directors (the \"Board\"). The Board shall have ultimate responsibility for the policies, programs, finances, and legal compliance of the Corporation.",
        ],
      },
      {
        num: "2.2",
        title: "Number and Composition",
        paragraphs: [
          "The Board shall consist of no fewer than three (3) and no more than eleven (11) directors. The initial Board is composed of the founding directors named in the Corporation's records.",
        ],
      },
      {
        num: "2.3",
        title: "Term",
        paragraphs: [
          "Each director shall serve a term of two (2) years and may be re-elected for additional terms. Founding directors shall serve staggered initial terms as designated by the Board to ensure continuity.",
        ],
      },
      {
        num: "2.4",
        title: "Election and Vacancies",
        paragraphs: [
          "Directors shall be elected by majority vote of the sitting Board. Vacancies, including those created by an increase in Board size, shall be filled by majority vote of the remaining directors and the appointee shall serve the remainder of the unexpired term.",
        ],
      },
      {
        num: "2.5",
        title: "Resignation and Removal",
        paragraphs: [
          "A director may resign at any time by delivering written notice to the Board Chair or Secretary. A director may be removed, with or without cause, by a two-thirds (2/3) vote of the directors then in office at a duly noticed meeting.",
        ],
      },
      {
        num: "2.6",
        title: "Compensation",
        paragraphs: [
          "Directors shall not receive compensation for their service as directors. Directors may be reimbursed for reasonable, documented out-of-pocket expenses incurred in the performance of their duties.",
        ],
      },
    ],
  },
  {
    num: "III",
    title: "Officers",
    sections: [
      {
        num: "3.1",
        title: "Officers of the Corporation",
        paragraphs: [
          "The officers of the Corporation shall include a Board Chair / President, a Vice Chair, a Treasurer, and a Secretary. The Board may create additional officer positions as it determines necessary.",
        ],
      },
      {
        num: "3.2",
        title: "Election and Term",
        paragraphs: [
          "Officers shall be elected annually by the Board and shall serve a one (1) year term or until their successors are duly elected. An officer may serve consecutive terms.",
        ],
      },
      {
        num: "3.3",
        title: "Duties",
        paragraphs: [
          "Officer duties are as follows:",
        ],
        list: [
          "Board Chair / President — Presides at Board meetings, leads governance priorities, and serves as the primary representative of the Corporation in formal and partner-facing matters.",
          "Vice Chair — Supports the Board Chair, presides in the Chair's absence, and helps coordinate committees and special initiatives.",
          "Treasurer — Oversees financial activity, signs off on disbursement records, ensures accurate books and records, presents financial reports to the Board, and partners with the Board Chair on fiduciary responsibility.",
          "Secretary — Maintains official records, including minutes, policies, votes, organizational documents, and required filings; ensures proper notice of meetings.",
        ],
      },
      {
        num: "3.4",
        title: "Removal and Vacancy",
        paragraphs: [
          "Any officer may be removed by majority vote of the Board, with or without cause. A vacancy in any office shall be filled by majority vote of the Board for the unexpired term.",
        ],
      },
    ],
  },
  {
    num: "IV",
    title: "Meetings of the Board",
    sections: [
      {
        num: "4.1",
        title: "Regular Meetings",
        paragraphs: [
          "The Board shall meet at least four (4) times per calendar year at such times and places as the Board may determine. Meetings may be held in person or by remote communication permitting simultaneous participation.",
        ],
      },
      {
        num: "4.2",
        title: "Special Meetings",
        paragraphs: [
          "Special meetings of the Board may be called by the Board Chair or by any two (2) directors upon at least seventy-two (72) hours' written notice (which may be delivered by email) stating the purpose of the meeting.",
        ],
      },
      {
        num: "4.3",
        title: "Quorum and Voting",
        paragraphs: [
          "A majority of the directors then in office shall constitute a quorum. The act of a majority of directors present at a meeting at which a quorum is present shall be the act of the Board, except where a greater vote is required by law or these bylaws.",
        ],
      },
      {
        num: "4.4",
        title: "Action Without a Meeting",
        paragraphs: [
          "Any action required or permitted to be taken at a meeting of the Board may be taken without a meeting if all directors then in office consent in writing (including by email) to such action.",
        ],
      },
      {
        num: "4.5",
        title: "Minutes",
        paragraphs: [
          "The Secretary shall keep minutes of all Board meetings, including attendance, motions, votes, and resolutions, and shall maintain such minutes as official records of the Corporation.",
        ],
      },
    ],
  },
  {
    num: "V",
    title: "Committees",
    sections: [
      {
        num: "5.1",
        title: "Standing and Ad-Hoc Committees",
        paragraphs: [
          "The Board may establish standing or ad-hoc committees, including but not limited to a Finance Committee, Governance Committee, Program & Community Impact Committee, and Fundraising Committee. Each committee shall act in an advisory capacity to the Board unless expressly delegated authority by Board resolution.",
        ],
      },
      {
        num: "5.2",
        title: "Committee Composition",
        paragraphs: [
          "Committee members shall be appointed by the Board Chair, subject to Board confirmation. Non-director community members may serve on committees other than as voting members of the Board.",
        ],
      },
    ],
  },
  {
    num: "VI",
    title: "Financial Stewardship",
    sections: [
      {
        num: "6.1",
        title: "Fiscal Year",
        paragraphs: [
          "The fiscal year of the Corporation shall be the calendar year unless otherwise determined by resolution of the Board.",
        ],
      },
      {
        num: "6.2",
        title: "Books and Records",
        paragraphs: [
          "The Corporation shall keep complete and accurate books of account, donation records, minutes, and policies. All organizational funds shall be held in accounts in the name of the Corporation and shall remain entirely separate from any personal account of any director, officer, employee, or volunteer.",
        ],
      },
      {
        num: "6.3",
        title: "Authorization of Expenditures",
        paragraphs: [
          "Expenditures shall be documented and supported by receipts, requests, or program documentation. The Board shall adopt internal controls governing approval thresholds, dual authorization for material disbursements, and periodic review of financial activity.",
        ],
      },
      {
        num: "6.4",
        title: "Donor Restrictions",
        paragraphs: [
          "Donor-restricted gifts shall be tracked separately and applied in accordance with the donor's stated restriction when feasible. All disbursements must serve the charitable purpose of the Corporation.",
        ],
      },
      {
        num: "6.5",
        title: "Annual Reporting",
        paragraphs: [
          "The Treasurer shall present an annual financial report to the Board and shall ensure that all required state and federal filings are timely submitted.",
        ],
      },
    ],
  },
  {
    num: "VII",
    title: "Conflicts of Interest",
    sections: [
      {
        num: "7.1",
        title: "Adoption of Policy",
        paragraphs: [
          "The Board shall adopt and maintain a written Conflict of Interest Policy. Each director and officer shall sign an annual disclosure form acknowledging the policy and disclosing any actual or potential conflicts.",
        ],
      },
      {
        num: "7.2",
        title: "Disclosure and Recusal",
        paragraphs: [
          "A director or officer with a personal, financial, or family interest in any matter before the Board shall disclose that interest, refrain from participating in deliberation on the matter, and recuse from any vote thereon. The disclosure and recusal shall be recorded in the minutes.",
        ],
      },
    ],
  },
  {
    num: "VIII",
    title: "Indemnification",
    sections: [
      {
        num: "8.1",
        title: "Indemnification of Directors and Officers",
        paragraphs: [
          "The Corporation shall indemnify its directors and officers to the fullest extent permitted by Massachusetts law against expenses reasonably incurred in connection with any action or proceeding to which they are made a party by reason of their service to the Corporation, except in matters involving willful misconduct or knowing violation of law.",
        ],
      },
      {
        num: "8.2",
        title: "Insurance",
        paragraphs: [
          "The Corporation may purchase and maintain directors and officers liability insurance, general liability insurance, and such other coverage as the Board determines appropriate.",
        ],
      },
    ],
  },
  {
    num: "IX",
    title: "Amendments",
    sections: [
      {
        num: "9.1",
        title: "Amendment Procedure",
        paragraphs: [
          "These bylaws may be amended, altered, or repealed by a two-thirds (2/3) vote of the directors then in office at a duly noticed meeting, provided that written notice of the proposed amendment is delivered to all directors at least seven (7) days in advance of the meeting.",
        ],
      },
    ],
  },
  {
    num: "X",
    title: "Dissolution",
    sections: [
      {
        num: "10.1",
        title: "Dissolution",
        paragraphs: [
          "Upon dissolution of the Corporation, after payment of all liabilities, the remaining assets shall be distributed to one or more organizations qualifying as exempt under Section 501(c)(3) of the Internal Revenue Code, selected by the Board, consistent with the charitable purposes of the Corporation and applicable Massachusetts law.",
        ],
      },
    ],
  },
  {
    num: "XI",
    title: "Adoption",
    sections: [
      {
        num: "11.1",
        title: "Adoption",
        paragraphs: [
          "These bylaws were adopted by the founding Board of Directors of LuxeNova Community Wellness, Inc. and shall take effect upon adoption. The Secretary shall maintain the executed bylaws as part of the official records of the Corporation.",
        ],
      },
    ],
  },
];

function BylawsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Governance Document"
          title="Bylaws of LuxeNova Community Wellness, Inc."
          description="Adopted bylaws governing the operations, board, finances, and accountability of LuxeNova Community Wellness, Inc., a Massachusetts nonprofit corporation."
        />

        <section className="mx-auto max-w-4xl px-6 pb-10">
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/50 text-rosewood">
                <ScrollText className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-rosewood">
                  Official Record
                </p>
                <p className="font-display text-base">
                  Bylaws of LuxeNova Community Wellness, Inc.
                </p>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                  Entity
                </dt>
                <dd>Massachusetts Nonprofit Corporation</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                  Tax Status
                </dt>
                <dd>501(c)(3) charitable organization</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                  Custodian
                </dt>
                <dd>Secretary of the Board</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20">
          <div className="space-y-10">
            {articles.map((article) => (
              <article
                key={article.num}
                className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8"
              >
                <header className="border-b border-border/60 pb-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-rosewood">
                    Article {article.num}
                  </p>
                  <h2 className="mt-1 font-display text-2xl">{article.title}</h2>
                </header>
                <div className="mt-6 space-y-7">
                  {article.sections.map((s) => (
                    <div key={s.num}>
                      <h3 className="font-display text-base">
                        <span className="text-rosewood">§ {s.num}</span>{" "}
                        <span>{s.title}</span>
                      </h3>
                      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
                        {s.paragraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                        {s.list && (
                          <ul className="ml-4 list-disc space-y-2">
                            {s.list.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-rosewood">
              Certification
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The undersigned, Secretary of LuxeNova Community Wellness, Inc.,
              certifies that the foregoing bylaws were adopted by the founding
              Board of Directors of the Corporation and constitute the bylaws
              currently in effect.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                  Secretary
                </p>
                <p className="mt-1 font-display text-base">Joe Younge</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                  Date Adopted
                </p>
                <p className="mt-1 font-display text-base">On file with the Corporation</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/governance"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition hover:border-rosewood/40 hover:text-rosewood"
            >
              ← Governance Overview
            </Link>
            <Link
              to="/conflict-of-interest"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-rosewood px-7 text-sm font-medium text-rosewood-foreground shadow-soft transition hover:opacity-95"
            >
              Conflict of Interest Policy
            </Link>
          </div>
        </section>

        <CalloutNote>
          These bylaws are the operating rulebook of LuxeNova Community
          Wellness. They are reviewed periodically and amended as needed by
          the Board to keep the Corporation aligned with its mission and
          applicable nonprofit law.
        </CalloutNote>
      </main>
      <Footer />
    </div>
  );
}
