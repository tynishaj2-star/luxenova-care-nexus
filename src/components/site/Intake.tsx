import { useState } from "react";
import { Upload, CalendarClock, MessagesSquare, ListChecks } from "lucide-react";

const features = [
  { icon: ListChecks, label: "Online intake forms" },
  { icon: Upload, label: "Secure document uploads" },
  { icon: CalendarClock, label: "Appointment requests" },
  { icon: MessagesSquare, label: "Referral tracking" },
];

export function Intake() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="intake" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Client Intake</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
            A calmer way to begin.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Tell us a little about your situation. A coordinator will reach out
            within one business day to confirm next steps. All submissions are
            encrypted and handled in line with HIPAA-aligned practices.
          </p>
          <ul className="mt-8 space-y-3">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm text-foreground/80">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-rosewood">
                  <f.icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="lg:col-span-7"
        >
          <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-luxe md:p-10">
            {submitted ? (
              <div className="grid place-items-center py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display text-xl">
                  ✓
                </span>
                <h3 className="mt-5 font-display text-2xl">Thank you — we've got it.</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  A LuxeNova coordinator will reach out within one business day
                  to confirm next steps and answer any questions.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" name="first" />
                  <Field label="Last name" name="last" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="Phone" name="phone" type="tel" />
                  <div className="sm:col-span-2">
                    <Label>I'm submitting as</Label>
                    <select className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20">
                      <option>An individual or family</option>
                      <option>A referral partner</option>
                      <option>A community organization</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>How can we help?</Label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe your situation or referral context…"
                      className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
                    />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree to our privacy practices.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-gradient-rosewood px-7 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
                  >
                    Send securely
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{children}</label>;
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
      />
    </div>
  );
}
