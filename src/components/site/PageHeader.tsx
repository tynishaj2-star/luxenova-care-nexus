import { Link } from "@tanstack/react-router";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-warm" />
      <div className="pointer-events-none absolute -top-32 -right-40 h-[420px] w-[420px] rounded-full bg-rosewood/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.2em] text-rosewood hover:opacity-80"
        >
          ← Back to home
        </Link>
        {eyebrow && (
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-5xl text-balance md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
