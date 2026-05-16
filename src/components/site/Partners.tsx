import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const partners = [
  "Hospitals",
  "Shelters",
  "Social Workers",
  "Clinics",
  "Providers",
  "Schools",
  "Community Orgs",
  "Faith Groups",
];

export function Partners() {
  return (
    <section id="partners" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-espresso text-ivory shadow-luxe">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-rosewood/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-[320px] w-[320px] rounded-full bg-taupe/20 blur-3xl" />

          <div className="relative grid gap-12 p-10 md:p-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.2em] text-ivory/70">Referral Partners</p>
              <h2 className="mt-3 font-display text-4xl text-balance md:text-5xl">
                Partner with LuxeNova Community Wellness.
              </h2>
              <p className="mt-5 max-w-xl text-ivory/75">
                We work alongside the organizations that touch families every
                day — providing reliable follow-through, real-time updates, and
                a partner you can stake your reputation on.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/referral"
                  className="inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-sm font-medium text-espresso transition hover:bg-ivory/90"
                >
                  Submit a Referral
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
                <Link
                  to="/referral"
                  className="inline-flex items-center gap-2 rounded-full border border-ivory/25 px-6 py-3 text-sm font-medium text-ivory transition hover:border-ivory/60"
                >
                  Become a Partner
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {partners.map((p) => (
                  <div
                    key={p}
                    className="rounded-2xl border border-ivory/15 bg-ivory/[0.04] px-4 py-5 text-sm text-ivory/90 backdrop-blur transition hover:border-ivory/30 hover:bg-ivory/[0.08]"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
