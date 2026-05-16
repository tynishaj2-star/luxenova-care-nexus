import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "LuxeNova made an overwhelming season feel manageable. Our coordinator listened, organized everything, and stayed two steps ahead.",
    name: "Amara J.",
    role: "Parent · Boston, MA",
  },
  {
    quote:
      "As a hospital social worker, I refer with confidence. Their follow-through and communication are unmatched in our network.",
    name: "Daniel R.",
    role: "Hospital Social Worker",
  },
  {
    quote:
      "Housing felt impossible until LuxeNova stepped in. We finally have stability — and a coordinator who feels like family.",
    name: "The Okonkwo Family",
    role: "Housing Navigation Client",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[i];
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Testimonials</p>
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-10 shadow-luxe md:p-16">
          <Quote className="mx-auto h-8 w-8 text-rosewood/60" strokeWidth={1.25} />
          <blockquote
            key={i}
            className="mt-6 font-display text-2xl leading-snug text-balance text-foreground md:text-3xl animate-fade-up"
          >
            "{t.quote}"
          </blockquote>
          <div className="mt-8">
            <p className="text-sm font-medium text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              aria-label="Previous"
              onClick={() => setI((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition hover:border-foreground/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-6 bg-rosewood" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              aria-label="Next"
              onClick={() => setI((p) => (p + 1) % testimonials.length)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition hover:border-foreground/30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
