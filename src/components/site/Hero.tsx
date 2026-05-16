import heroImg from "@/assets/hero-family.jpg";

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
              Community-based wellness, reimagined
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
              Compassionate community support.
              <span className="block text-rosewood italic">Modern care coordination.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
              LuxeNova Community Wellness helps individuals and families navigate
              life's challenges through personalized support, housing assistance,
              wellness advocacy, and community-based programs.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#intake"
                className="inline-flex items-center rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
              >
                Request Services
              </a>
              <a
                href="#intake"
                className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-soft transition hover:border-foreground/30"
              >
                Submit a Referral
              </a>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-8">
              {[
                { k: "24h", v: "Referral response" },
                { k: "98%", v: "Partner satisfaction" },
                { k: "1:1", v: "Care coordinators" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl text-foreground">{s.k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl bg-card shadow-luxe">
              <img
                src={heroImg}
                alt="A care coordinator meeting with a multigenerational family in a warm, sunlit living room"
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
                  <p className="text-xs text-muted-foreground">Care plan active</p>
                  <p className="text-sm font-medium">Coordinator assigned</p>
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
