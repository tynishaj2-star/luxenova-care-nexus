import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export function ReferralCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-10 shadow-luxe md:p-16">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[360px] w-[360px] rounded-full bg-rosewood/10 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3.5 py-1.5 text-xs tracking-wide text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-rosewood" />
                Confidential stabilization request
              </span>
              <h2 className="mt-5 font-display text-4xl md:text-5xl text-balance">
                Need stabilization support for a family?
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground">
                Families, partners, schools, shelters, faith groups, and
                community agencies can request help through our confidential
                Emergency Stabilization Request form.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                to="/referrals"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-rosewood px-7 py-3.5 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
              >
                Request Help
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
