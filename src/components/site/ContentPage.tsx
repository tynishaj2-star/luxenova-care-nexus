import type { LucideIcon } from "lucide-react";

export function ContentSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pb-12">
      <div className="mx-auto max-w-5xl px-6">
        {title && (
          <h2 className="mb-6 font-display text-3xl md:text-4xl text-balance">
            {title}
          </h2>
        )}
        <div className="space-y-5 text-foreground/85 leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
}

export function CardGrid({
  items,
  columns = 3,
}: {
  items: { icon?: LucideIcon; title: string; body: string; meta?: string }[];
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`grid gap-5 ${cols}`}>
          {items.map((it) => (
            <article
              key={it.title}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-rosewood/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {it.icon && (
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                  <it.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
              )}
              {it.meta && (
                <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-rosewood/80">
                  {it.meta}
                </p>
              )}
              <h3 className="mt-4 font-display text-xl">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {it.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CalloutNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-16">
      <div className="rounded-3xl border border-rosewood/30 bg-accent/40 p-7 text-sm leading-relaxed text-foreground/85 shadow-soft md:p-8">
        {children}
      </div>
    </div>
  );
}
