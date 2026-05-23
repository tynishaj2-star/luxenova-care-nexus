import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CheckCircle2, Upload, HeartHandshake, Users, Compass, Megaphone } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Get Involved — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Volunteer with LuxeNova Community Wellness. Community volunteers, resource navigators, intake coordinators, and grant & outreach support roles.",
      },
      { property: "og:title", content: "Get Involved — LuxeNova" },
      {
        property: "og:description",
        content:
          "Join a Massachusetts community relief team helping families stabilize.",
      },
    ],
  }),
  component: GetInvolvedPage,
});

const roles = [
  { icon: Users, title: "Community Volunteers", body: "Help with outreach events, supply drives, and family check-ins across Massachusetts." },
  { icon: Compass, title: "Resource Navigators", body: "Connect families to housing, utility, autism, and benefit resources." },
  { icon: HeartHandshake, title: "Intake Coordinators", body: "Review stabilization requests and coordinate next steps with families." },
  { icon: Megaphone, title: "Grant & Outreach Support", body: "Help with grant writing, sponsor outreach, and partner communication." },
];

function GetInvolvedPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Get Involved"
          title="Stand with Massachusetts families."
          description="LuxeNova Community Wellness is building a community-rooted team of volunteers, navigators, and outreach supporters helping families stabilize."
        />

        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-display text-3xl md:text-4xl">Roles we welcome</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {roles.map((o) => (
                <article key={o.title} className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-rosewood">
                      <o.icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-display text-xl">{o.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{o.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-luxe md:p-10">
              {submitted ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-rosewood" strokeWidth={1.5} />
                  <h3 className="mt-5 font-display text-2xl">Thank you — interest received.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our team will review your interest and follow up shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <h3 className="font-display text-2xl sm:col-span-2">Express interest</h3>
                  <FormField label="Full Name" required>
                    <input required className="form-input" name="name" />
                  </FormField>
                  <FormField label="Phone" required>
                    <input required type="tel" className="form-input" name="phone" />
                  </FormField>
                  <FormField label="Email" required span="full">
                    <input required type="email" className="form-input" name="email" />
                  </FormField>
                  <FormField label="Area of Interest" required>
                    <select required className="form-input" defaultValue="">
                      <option value="" disabled>Select…</option>
                      {roles.map((r) => (
                        <option key={r.title}>{r.title}</option>
                      ))}
                      <option>Other</option>
                    </select>
                  </FormField>
                  <FormField label="Availability">
                    <input className="form-input" name="availability" placeholder="e.g. weekday evenings" />
                  </FormField>
                  <FormField label="Relevant Experience" span="full">
                    <textarea rows={3} className="form-input min-h-[110px] py-3" name="experience" />
                  </FormField>
                  <FormField label="Upload Resume or Bio" span="full">
                    <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-4 text-sm transition hover:border-rosewood/50">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-rosewood">
                        <Upload className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span className="text-muted-foreground">Click to upload · PDF, DOC</span>
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                    </label>
                  </FormField>
                  <FormField label="Message" span="full">
                    <textarea rows={4} className="form-input min-h-[120px] py-3" name="message" />
                  </FormField>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full bg-gradient-rosewood px-7 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
                    >
                      Submit Interest
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FormField({
  label,
  required,
  span,
  children,
}: {
  label: string;
  required?: boolean;
  span?: "full";
  children: React.ReactNode;
}) {
  return (
    <div className={span === "full" ? "sm:col-span-2" : ""}>
      <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label} {required && <span className="text-rosewood">*</span>}
      </label>
      {children}
    </div>
  );
}
