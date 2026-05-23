import { Check } from "lucide-react";
import vesselImg from "@/assets/accent-vessel.jpg";

const points = [
  { t: "Family-centered", d: "Every plan is built around the household's actual barriers — not a one-size-fits-all script." },
  { t: "Timely response", d: "Stabilization requests are reviewed quickly so families can act before a crisis deepens." },
  { t: "Transparent impact", d: "We track families supported, relief delivered, and outcomes documented." },
  { t: "Autism-aware support", d: "Coordinated care for households raising autistic children, with sensitivity and respect." },
  { t: "Community partnerships", d: "Tight coordination with schools, shelters, faith groups, and local agencies." },
  { t: "Dignity first", d: "Confidential, respectful, and never paternalistic — families stay in the lead." },
];

export function WhyUs() {
  return (
    <section id="why" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-warm" />
      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Why LuxeNova</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
            Relief delivered with dignity and discipline.
          </h2>
          <p className="mt-5 text-muted-foreground">
            We pair the warmth of community-based work with the discipline of
            modern operations — so families feel respected and partners and
            funders see real, documented impact.
          </p>
          <div className="mt-10 hidden overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe lg:block">
            <img
              src={vesselImg}
              alt="A Black mother gently embracing her young son in a softly lit living room"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-80 w-full object-cover"
            />
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {points.map((p) => (
            <li
              key={p.t}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition hover:border-rosewood/30"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <h3 className="font-display text-lg">{p.t}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
