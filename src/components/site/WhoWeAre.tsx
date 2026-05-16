import { Building2, HeartHandshake, ShieldCheck } from "lucide-react";

const cards = [
  {
    icon: Building2,
    title: "Our Agency",
    body: "LuxeNova Community Wellness provides compassionate, organized, community-based support services focused on helping individuals and families navigate challenges, access resources, and move forward with stability and dignity.",
  },
  {
    icon: HeartHandshake,
    title: "Our Support Approach",
    body: "Our team focuses on personalized care coordination, communication, resource navigation, wellness advocacy, and responsive support tailored to each client's unique needs.",
  },
  {
    icon: ShieldCheck,
    title: "Our Commitment",
    body: "We are committed to professionalism, timely follow-up, respectful communication, secure systems, and client-centered support throughout every stage of care coordination.",
  },
];

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Who We Are</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
            Built on care, organized for impact.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-rosewood/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                <c.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 font-display text-2xl">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
