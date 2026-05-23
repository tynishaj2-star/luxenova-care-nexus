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
    icon: Puzzle,
    title: "Autism Family Support",
    body: "Resource connection, navigation, and family support for households raising autistic children.",
  },
  {
    icon: HeartHandshake,
    title: "Family Stabilization",
    body: "Wraparound coordination that helps households move from crisis to stability with dignity.",
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
            stabilization, documentation, and community resources into one
            coordinated response.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
