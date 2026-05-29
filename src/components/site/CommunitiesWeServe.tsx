import heroImg from "@/assets/hero-family.jpg";
import hispanicImg from "@/assets/family-hispanic.jpg";
import whiteImg from "@/assets/family-white.jpg";

const families = [
  {
    src: heroImg,
    alt: "A Black Massachusetts family with two young children sitting together on the front porch of their home at golden hour",
    caption: "Every family. Every street. Every ZIP code.",
  },
  {
    src: hispanicImg,
    alt: "A Hispanic mother and father with two children sitting on the front steps of their Massachusetts home at golden hour",
    caption: "Bilingual navigators. Culturally-rooted care.",
  },
  {
    src: whiteImg,
    alt: "A white Massachusetts mother and father with three young children sitting together on a cozy living room couch in warm window light",
    caption: "Working families one missed paycheck from collapse.",
  },
];

export function CommunitiesWeServe() {
  return (
    <section id="communities-we-serve" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">
            Communities We Serve
          </p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
            Relief that reflects every Massachusetts family.
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            From Black and Hispanic households to working-class families across
            the Commonwealth, LuxeNova Community Wellness meets neighbors where
            they are — with dignity, transparency, and culturally-aware support.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {families.map((f) => (
            <figure
              key={f.src}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
            >
              <img
                src={f.src}
                alt={f.alt}
                width={1280}
                height={1024}
                loading="lazy"
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:h-80"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/55 via-espresso/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-lg leading-snug text-ivory">
                  {f.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
