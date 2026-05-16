import {
  HeartHandshake,
  Home,
  Users,
  Sparkles,
  Compass,
  FileText,
  Video,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    icon: HeartHandshake,
    title: "Care Coordination",
    body: "Personalized navigation across providers, benefits, and services — one dedicated coordinator, one clear plan.",
  },
  {
    icon: Home,
    title: "Housing Navigation",
    body: "Stabilization support, applications, and landlord coordination to help families find and keep a home.",
  },
  {
    icon: Users,
    title: "Community Support",
    body: "Wraparound community-based services that meet people where they are — at home, school, or in the neighborhood.",
  },
  {
    icon: Sparkles,
    title: "Family Support",
    body: "Coaching, advocacy, and behavioral health support tailored to caregivers, children, and the whole household.",
  },
  {
    icon: ShieldCheck,
    title: "Wellness Advocacy",
    body: "Whole-person advocacy for mental, physical, and social wellbeing across the care continuum.",
  },
  {
    icon: Compass,
    title: "Resource Navigation",
    body: "A guided pathway to food, transportation, childcare, legal aid, and the local resources that matter most.",
  },
  {
    icon: FileText,
    title: "Documentation Assistance",
    body: "Help with intake forms, benefits paperwork, recertifications, and secure document handling.",
  },
  {
    icon: Video,
    title: "Virtual Coordination",
    body: "Secure telehealth-style sessions and digital check-ins for clients who prefer remote support.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Our Services</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
              A continuum of care, organized around the people we serve.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Every engagement begins with listening. From there, we build a plan
            that integrates clinical, social, and community resources into one
            seamless experience.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
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
