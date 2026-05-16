import { Check } from "lucide-react";
import vesselImg from "@/assets/accent-vessel.jpg";

const points = [
  { t: "Compassionate support", d: "Trauma-informed, culturally responsive care from people who listen first." },
  { t: "Timely follow-up", d: "Most referrals receive a coordinator response within 24 business hours." },
  { t: "Organized systems", d: "A modern platform keeps your case visible, tracked, and accountable." },
  { t: "Personalized care", d: "No two plans are alike — we design around each family's goals." },
  { t: "Community partnerships", d: "Tight integration with hospitals, schools, shelters, and providers." },
  { t: "Client-centered approach", d: "You stay in the driver's seat; we make the road easier to travel." },
];

export function WhyUs() {
  return (
    <section id="why" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-warm" />
      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Why LuxeNova</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
            Premium care, delivered with quiet excellence.
          </h2>
          <p className="mt-5 text-muted-foreground">
            We blend the warmth of community-based work with the discipline of
            modern healthcare operations — so families feel seen, and partners
            feel confident.
          </p>
          <div className="mt-10 hidden overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe lg:block">
            <img
              src={vesselImg}
              alt="A handcrafted ceramic vessel in warm taupe tones — a symbol of quiet craft"
              width={1024}
              height={1280}
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
