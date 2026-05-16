import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { CheckCircle2, Upload, Sparkles, HeartHandshake, Users, Briefcase, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Join the LuxeNova Community Wellness team. Clinician, care coordination, support staff, and administrative opportunities.",
      },
      { property: "og:title", content: "Careers at LuxeNova" },
      {
        property: "og:description",
        content:
          "Build your career with a compassionate, modern community wellness team.",
      },
    ],
  }),
  component: CareersPage,
});

const why = [
  { icon: Sparkles, title: "Modern, organized systems", body: "Premium tooling that keeps your caseload visible and your day humane." },
  { icon: HeartHandshake, title: "Mission with integrity", body: "Community-rooted work, delivered with discipline and respect." },
  { icon: Users, title: "Collaborative team", body: "Coordinators, clinicians, and support staff who actually back each other up." },
];

const opportunities = [
  { icon: Stethoscope, title: "Clinician Opportunities", body: "Licensed clinicians ready to deliver compassionate, community-based care." },
  { icon: HeartHandshake, title: "Care Coordination Opportunities", body: "Coordinators who thrive on follow-through and trusted communication." },
  { icon: Users, title: "Support Staff Opportunities", body: "Community-based support roles working directly with clients and families." },
  { icon: Briefcase, title: "Administrative Opportunities", body: "Operations, intake, and program support roles powering the organization." },
];

function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [licensed, setLicensed] = useState("No");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Careers"
          title="Join Our Team"
          description="LuxeNova Community Wellness is building a compassionate, organized, and community-focused team dedicated to supporting individuals and families."
        />

        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-display text-3xl md:text-4xl">Why work with us</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {why.map((w) => (
                <div key={w.title} className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-rosewood">
                    <w.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 font-display text-xl">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-display text-3xl md:text-4xl">Open opportunities</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {opportunities.map((o) => (
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
                  <h3 className="mt-5 font-display text-2xl">Application received.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thank you for your interest. Our team will review your
                    application and follow up shortly.
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
                  <h3 className="font-display text-2xl sm:col-span-2">Apply now</h3>
                  <FormField label="Full Name" required>
                    <input required className="form-input" name="name" />
                  </FormField>
                  <FormField label="Phone Number" required>
                    <input required type="tel" className="form-input" name="phone" />
                  </FormField>
                  <FormField label="Email Address" required span="full">
                    <input required type="email" className="form-input" name="email" />
                  </FormField>
                  <FormField label="Position Applying For" required>
                    <input required className="form-input" name="position" />
                  </FormField>
                  <FormField label="Years of Experience">
                    <input type="number" min={0} className="form-input" name="years" />
                  </FormField>
                  <FormField label="Licensed or Credentialed?">
                    <select
                      value={licensed}
                      onChange={(e) => setLicensed(e.target.value)}
                      className="form-input"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </FormField>
                  {licensed === "Yes" && (
                    <FormField label="License Type">
                      <input className="form-input" name="licenseType" />
                    </FormField>
                  )}
                  <FormField label="Upload Resume" span="full">
                    <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-4 text-sm transition hover:border-rosewood/50">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-rosewood">
                        <Upload className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span className="text-muted-foreground">Click to upload · PDF, DOC</span>
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                    </label>
                  </FormField>
                  <FormField label="Additional Message" span="full">
                    <textarea rows={4} className="form-input min-h-[120px] py-3" />
                  </FormField>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full bg-gradient-rosewood px-7 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95"
                    >
                      Submit Application
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
