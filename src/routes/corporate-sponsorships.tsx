import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Baby,
  Users,
  Shield,
  Heart,
  Accessibility,
  Puzzle,
  HandHeart,
  GraduationCap,
  Briefcase,
  Home,
  Wallet,
  UtensilsCrossed,
  MapPin,
  Backpack,
  Gift,
  Apple,
  Shirt,
  Sparkles,
  Activity,
  BookOpen,
  Calculator,
  CreditCard,
  FileText,
  Building2,
  Puzzle as PuzzleIcon,
  Users2,
  HeartHandshake,
  Truck,
  PartyPopper,
  LifeBuoy,
  Handshake,
  BadgeCheck,
  Megaphone,
  Landmark,
  TrendingUp,
  Award,
  Check,
  ArrowRight,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/corporate-sponsorships")({
  head: () => ({
    meta: [
      { title: "Corporate Sponsorships — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Partner with LuxeNova Community Wellness, Inc. as a corporate sponsor. Support Massachusetts families through education, emergency assistance, and community outreach.",
      },
      { property: "og:title", content: "Corporate Sponsorships — LuxeNova Community Wellness, Inc." },
      {
        property: "og:description",
        content:
          "Fortune-caliber sponsorship pathways for businesses, foundations, and community organizations supporting Massachusetts families.",
      },
    ],
  }),
  component: CorporateSponsorshipsPage,
});

const served = [
  { icon: Baby, label: "Children & Youth" },
  { icon: Users, label: "Families Experiencing Financial Hardship" },
  { icon: Shield, label: "Veterans" },
  { icon: Heart, label: "Senior Citizens" },
  { icon: Accessibility, label: "Individuals with Disabilities" },
  { icon: Puzzle, label: "Individuals with Autism & Developmental Disabilities" },
  { icon: HandHeart, label: "Survivors of Domestic Violence" },
  { icon: GraduationCap, label: "Students" },
  { icon: Briefcase, label: "Job Seekers" },
  { icon: Home, label: "Individuals Experiencing Homelessness" },
  { icon: Wallet, label: "Low-Income Households" },
  { icon: UtensilsCrossed, label: "Individuals Experiencing Food Insecurity" },
  { icon: MapPin, label: "Underserved Communities Throughout Massachusetts" },
];

const programs = [
  { icon: Backpack, title: "School Supply & Backpack Drives" },
  { icon: Gift, title: "Holiday Gift Programs" },
  { icon: Apple, title: "Food Assistance" },
  { icon: Shirt, title: "Clothing Assistance" },
  { icon: Sparkles, title: "Hygiene & Essential Needs Distribution" },
  { icon: Activity, title: "Community Wellness Programs" },
  { icon: BookOpen, title: "Financial Literacy Education" },
  { icon: Calculator, title: "Tax Education & Free Tax Preparation" },
  { icon: CreditCard, title: "Credit Education" },
  { icon: FileText, title: "Resume & Workforce Development" },
  { icon: Building2, title: "Housing Resource Navigation" },
  { icon: PuzzleIcon, title: "Autism & Disability Support" },
  { icon: Users2, title: "Youth Programs" },
  { icon: HeartHandshake, title: "Volunteer Opportunities" },
  { icon: Briefcase, title: "Corporate Volunteer Days" },
  { icon: Truck, title: "Donation Drives" },
  { icon: PartyPopper, title: "Community Outreach Events" },
  { icon: LifeBuoy, title: "Emergency Assistance Referrals" },
  { icon: Handshake, title: "Community Partnerships" },
];

const whySponsor = [
  { icon: Megaphone, title: "Community Impact", body: "Direct, measurable support that stabilizes households and strengthens Massachusetts neighborhoods." },
  { icon: BadgeCheck, title: "Positive Brand Visibility", body: "Elevated recognition across our website, social platforms, events, and impact reporting." },
  { icon: Landmark, title: "Corporate Social Responsibility", body: "Align your organization with a mission-driven 501(c)(3) advancing equity and wellness." },
  { icon: Users2, title: "Employee Volunteer Opportunities", body: "Turnkey volunteer days that engage your team in purpose-driven community work." },
  { icon: TrendingUp, title: "Tax-Deductible Contributions", body: "All qualifying sponsorships are tax-deductible under Section 501(c)(3) of the IRC." },
  { icon: HeartHandshake, title: "Meaningful Community Engagement", body: "Authentic partnership with the families, leaders, and organizations we serve." },
];

const tiers = [
  { name: "Community Supporter", amount: "$250 – $499", accent: "text-foreground/70" },
  { name: "Bronze Sponsor", amount: "$500 – $999", accent: "text-[#a97142]" },
  { name: "Silver Sponsor", amount: "$1,000 – $2,499", accent: "text-[#8a8f98]" },
  { name: "Gold Sponsor", amount: "$2,500 – $4,999", accent: "text-[#b8892b]" },
  { name: "Platinum Sponsor", amount: "$5,000 – $9,999", accent: "text-[#4a5568]" },
  { name: "Presenting Sponsor", amount: "$10,000+", accent: "text-rosewood", featured: true },
] as const;

// Each level inherits prior benefits (indices 0..n).
const benefits = [
  "Website Recognition",
  "Social Media Recognition",
  "Logo Placement",
  "Event Recognition",
  "Employee Volunteer Opportunities",
  "Sponsor Spotlight",
  "Annual Impact Report",
  "Recognition Certificate",
];

const otherWays = [
  { icon: Handshake, title: "Corporate Sponsorship", body: "Annual or program-specific sponsorship packages tailored to your goals." },
  { icon: Users2, title: "Employee Volunteer Days", body: "Coordinated team volunteer experiences at drives, events, and outreach." },
  { icon: TrendingUp, title: "Matching Gift Programs", body: "Amplify employee giving through corporate matching partnerships." },
  { icon: Backpack, title: "School Supply Drives", body: "Host or underwrite backpack and school supply drives for students." },
  { icon: Apple, title: "Food Drives", body: "Sponsor or host food drives supporting families facing food insecurity." },
  { icon: Gift, title: "Holiday Gift Programs", body: "Adopt families and children for holiday and back-to-school giving." },
  { icon: PartyPopper, title: "Sponsor an Event", body: "Underwrite a community event, gala, or wellness activation." },
  { icon: Heart, title: "Sponsor a Child", body: "Support a child's essential needs, education, or enrichment." },
  { icon: Users, title: "Sponsor a Family", body: "Close the gap on rent, utilities, autism supports, or essentials." },
  { icon: Truck, title: "In-Kind Donations", body: "Contribute goods, services, or professional expertise." },
];

function CorporateSponsorshipsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="pointer-events-none absolute inset-0 bg-gradient-warm" />
          <div className="pointer-events-none absolute -top-32 -right-40 h-[520px] w-[520px] rounded-full bg-rosewood/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-rosewood/10 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.22em] text-rosewood hover:opacity-80"
            >
              ← LuxeNova Community Wellness, Inc.
            </Link>
            <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Corporate Sponsorships · 2026
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-balance md:text-7xl">
              Become a Corporate Sponsor
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
              Support LuxeNova Community Wellness and help empower individuals,
              strengthen families, and build healthier communities throughout
              Massachusetts.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-7 py-3.5 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
              >
                Become a Sponsor <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:tjohnson@luxenovacommunitywellness.com?subject=Sponsorship%20Packet%20Request"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition hover:border-foreground/30"
              >
                <Download className="h-4 w-4" /> Download Sponsorship Packet
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-rosewood" /> 501(c)(3) Nonprofit</span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-rosewood" /> Massachusetts</span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-rosewood" /> Tax-Deductible</span>
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-rosewood">Who We Are</p>
                <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                  A Massachusetts 501(c)(3) built for lasting community change.
                </h2>
              </div>
              <div className="md:col-span-8 space-y-5 text-base leading-relaxed text-foreground/85">
                <p>
                  LuxeNova Community Wellness, Inc. is a Massachusetts-based
                  501(c)(3) nonprofit organization dedicated to empowering
                  individuals, strengthening families, and building healthier
                  communities through education, advocacy, direct assistance,
                  and meaningful community partnerships.
                </p>
                <p>
                  Our mission is to remove barriers that prevent individuals
                  and families from achieving stability by providing essential
                  resources, educational opportunities, emergency assistance,
                  and programs that promote long-term independence, wellness,
                  and economic empowerment.
                </p>
                <p className="text-foreground">
                  We believe every person deserves access to the support and
                  opportunities needed to thrive, regardless of their
                  circumstances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE SERVE */}
        <section className="border-t border-border/60 bg-accent/30 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-rosewood">Who We Serve</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                Neighbors across every corner of the Commonwealth.
              </h2>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {served.map((s) => (
                <article
                  key={s.label}
                  className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                    <s.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <p className="pt-2 text-sm font-medium leading-snug">{s.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-rosewood">What We Do</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                Programs that stabilize, educate, and empower.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <article
                  key={p.title}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                      <p.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-lg leading-snug">{p.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHY SPONSOR */}
        <section className="relative overflow-hidden border-y border-border/60 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-gradient-warm opacity-70" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-rosewood">Why Sponsor LuxeNova?</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                Purpose-built partnership. Measurable impact.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {whySponsor.map((w) => (
                <article
                  key={w.title}
                  className="rounded-3xl border border-border/70 bg-card/90 p-7 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-rosewood">
                    <w.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 font-display text-xl">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SPONSORSHIP COMPARISON TABLE */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-rosewood">Sponsorship Opportunities</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                Choose the level of partnership that fits your mission.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Each level includes all benefits from the previous level, plus additional recognition.
              </p>
            </div>

            {/* Desktop comparison table */}
            <div className="mt-14 hidden overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gradient-warm">
                    <th className="w-56 px-6 py-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Benefit
                    </th>
                    {tiers.map((t) => (
                      <th
                        key={t.name}
                        className={`px-4 py-6 align-top ${
                          t.featured ? "bg-rosewood/5" : ""
                        }`}
                      >
                        <div className={`text-xs uppercase tracking-[0.18em] ${t.accent}`}>
                          {t.name}
                        </div>
                        <div className="mt-2 font-display text-xl text-foreground">
                          {t.amount}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {benefits.map((b, bi) => (
                    <tr key={b} className="border-t border-border/60">
                      <td className="px-6 py-4 text-sm font-medium">{b}</td>
                      {tiers.map((t, ti) => {
                        const included = ti >= bi;
                        return (
                          <td
                            key={t.name}
                            className={`px-4 py-4 ${t.featured ? "bg-rosewood/5" : ""}`}
                          >
                            {included ? (
                              <Check className="h-5 w-5 text-rosewood" strokeWidth={2.5} />
                            ) : (
                              <span className="text-border">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="border-t border-border/60">
                    <td className="px-6 py-6" />
                    {tiers.map((t) => (
                      <td key={t.name} className={`px-4 py-6 ${t.featured ? "bg-rosewood/5" : ""}`}>
                        <Link
                          to="/contact"
                          className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-medium transition ${
                            t.featured
                              ? "bg-gradient-rosewood text-rosewood-foreground shadow-soft hover:opacity-95"
                              : "border border-border bg-background hover:border-foreground/30"
                          }`}
                        >
                          Select <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile/tablet stacked tiers */}
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:hidden">
              {tiers.map((t, ti) => (
                <article
                  key={t.name}
                  className={`relative overflow-hidden rounded-3xl border p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-luxe ${
                    t.featured
                      ? "border-rosewood/40 bg-gradient-warm"
                      : "border-border/70 bg-card"
                  }`}
                >
                  {t.featured && (
                    <span className="absolute right-5 top-5 rounded-full bg-gradient-rosewood px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-rosewood-foreground shadow-soft">
                      Featured
                    </span>
                  )}
                  <p className={`text-[11px] uppercase tracking-[0.22em] ${t.accent}`}>
                    {t.name}
                  </p>
                  <p className="mt-2 font-display text-3xl">{t.amount}</p>
                  <ul className="mt-6 space-y-3">
                    {benefits.map((b, bi) => {
                      const included = ti >= bi;
                      return (
                        <li
                          key={b}
                          className={`flex items-start gap-3 text-sm ${
                            included ? "text-foreground" : "text-muted-foreground/50 line-through"
                          }`}
                        >
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              included ? "text-rosewood" : "text-muted-foreground/30"
                            }`}
                            strokeWidth={2.5}
                          />
                          <span>{b}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
                      t.featured
                        ? "bg-gradient-rosewood text-rosewood-foreground shadow-luxe hover:opacity-95"
                        : "border border-border bg-background hover:border-foreground/30"
                    }`}
                  >
                    Select {t.name} <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ADDITIONAL WAYS */}
        <section className="border-t border-border/60 bg-accent/30 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-rosewood">
                Additional Ways to Support
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                Beyond sponsorship — every partnership matters.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {otherWays.map((o) => (
                <article
                  key={o.title}
                  className="group rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                    <o.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 font-display text-base leading-snug">{o.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{o.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SPONSOR RECOGNITION */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-rosewood">
                Our Corporate Sponsors
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                Proudly recognized. Publicly celebrated.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Our Corporate Sponsors will be proudly recognized here.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="group flex h-32 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/60 text-center shadow-soft transition hover:border-rosewood/40 hover:bg-card"
                >
                  <div className="px-4">
                    <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-accent text-rosewood">
                      <Building2 className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Your logo here
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-rosewood hover:opacity-80"
              >
                Add your organization to this wall <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-rosewood" />
          <div className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-6 text-center text-rosewood-foreground">
            <p className="text-[11px] uppercase tracking-[0.28em] opacity-80">
              Partner With Us
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[1.05] text-balance md:text-6xl">
              Help Build Stronger Communities
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed opacity-90 md:text-lg">
              Every sponsorship helps LuxeNova Community Wellness provide
              education, emergency assistance, community outreach, essential
              resources, and life-changing opportunities for children,
              families, veterans, seniors, individuals with disabilities, and
              underserved communities throughout Massachusetts.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground shadow-luxe transition hover:opacity-95"
              >
                Become a Sponsor <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-7 py-3.5 text-sm font-medium text-rosewood-foreground transition hover:bg-white/10"
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
