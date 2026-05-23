import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-family.jpg";

const trustBadges = [
  "Emergency Rental Assistance",
  "Utility Relief",
  "Autism Family Support",
  "Family Stabilization",
  "Resource Navigation",
  "Documented Impact",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-warm" />
      <div className="pointer-events-none absolute -top-32 -right-40 h-[520px] w-[520px] rounded-full bg-rosewood/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-taupe/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs tracking-wide text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-rosewood" />
              Massachusetts community relief & family stabilization
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
              Helping Families Stabilize.
              <span className="block text-rosewood italic">Before Crisis Becomes Collapse.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
              LuxeNova Community Wellness helps Massachusetts families facing
              housing instability, utility shutoffs, autism-related support
              gaps, and resource barriers access organized community support
              with dignity, transparency, and care.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/referrals"
                className="inline-flex items-center rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
              >
                Request Help
              </Link>
              <Link
                to="/donate"
                className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-soft transition hover:border-foreground/30"
              >
                Donate
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-2">
              {trustBadges.map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl bg-card shadow-luxe">
              <img
                src={heroImg}
                alt="A Black Massachusetts family with two young children sitting together on the front porch of their home at golden hour"
                width={1536}
                height={1280}
                className="h-[520px] w-full object-cover md:h-[620px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 hidden w-64 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-luxe backdrop-blur md:block animate-float">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent">
                  <span className="h-2 w-2 rounded-full bg-rosewood" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stabilization plan</p>
                  <p className="text-sm font-medium">Navigator assigned</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full bg-gradient-rosewood" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
