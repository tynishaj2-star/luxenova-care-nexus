import {
  Home,
  Zap,
  Puzzle,
  HeartHandshake,
  Compass,
  Megaphone,
  FileText,
  Handshake,
} from "lucide-react";

const featured = [
  {
    icon: HeartHandshake,
    title: "Community Stabilization",
    tagline: "Signature Program",
    body: "A wraparound Community Stabilization plan that moves a household from crisis to steady ground — rent, utilities, documentation, and follow-through coordinated by a dedicated navigator.",
    points: [
      "Dedicated Community Stabilization navigator",
      "30 / 60 / 90-day follow-through",
      "Coordinated with schools, housing, and benefits partners",
    ],
  },
  {
    icon: Puzzle,
    title: "Autism & Special Needs Family Support",
    tagline: "Specialized Care",
    body: "Composed, informed support for households raising autistic children and children with special needs — resource navigation, advocacy, and respite-aware planning that honors how each family lives.",
    points: [
      "IEP, EI, and DDS resource navigation",
      "Sensory-aware intake and communication",
      "Connections to respite and specialized providers",
    ],
  },
];

const programs = [
  {
    icon: Home,
    title: "Emergency Rental Assistance",
    body: "Documented help for families facing rent emergencies, late notices, and eviction risk.",
  },
  {
    icon: Zap,
    title: "Utility Relief",
    body: "Support for households facing utility shutoffs — gas, electric, and water — before service is lost.",
  },
  {
    icon: Compass,
    title: "Resource Navigation",
    body: "A guided pathway to food, transportation, childcare, benefits, and the local resources that matter most.",
  },
  {
    icon: Megaphone,
    title: "Community Outreach",
    body: "Neighborhood-level outreach that meets families where they are — in schools, churches, and community spaces.",
  },
  {
    icon: FileText,
    title: "Documentation Assistance",
    body: "Help with intake forms, benefit applications, recertifications, and secure document handling.",
  },
  {
    icon: Handshake,
    title: "Partner Coordination",
    body: "Coordinated relief alongside schools, housing partners, faith groups, and community agencies.",
  },
];

export function Services() {
  return (
    <section id="programs" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Our Programs</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
              Community relief, organized around the families we serve.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Every request begins with listening. From there, we organize
            Community Stabilization, documentation, and community resources into one
            coordinated response.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {featured.map((f) => (
            <article
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 shadow-soft transition-all duration-700 hover:-translate-y-1.5 hover:border-rosewood/40 hover:shadow-luxe md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-gradient-warm" />
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-rosewood/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-rosewood/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-rosewood transition-all duration-500 group-hover:scale-110 group-hover:bg-rosewood group-hover:text-rosewood-foreground group-hover:shadow-luxe">
                    <f.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-rosewood/80">
                    {f.tagline}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl md:text-3xl text-balance">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {f.body}
                </p>
                <ul className="mt-6 space-y-2">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-sm text-foreground/80"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rosewood transition-transform duration-500 group-hover:scale-150" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((s) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-rosewood/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                <s.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 font-display text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
