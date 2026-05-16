import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Testimonials</p>
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-10 shadow-luxe md:p-16">
          <Quote className="mx-auto h-8 w-8 text-rosewood/60" strokeWidth={1.25} />
          <p className="mt-6 font-display text-2xl leading-snug text-balance text-foreground md:text-3xl">
            Client and community partner testimonials coming soon.
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
            We're carefully gathering reflections from the families and partners
            we serve. Check back soon to hear directly from our community.
          </p>
        </div>
      </div>
    </section>
  );
}
