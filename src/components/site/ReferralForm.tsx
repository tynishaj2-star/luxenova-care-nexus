import { useState } from "react";
import { CheckCircle2, Upload, ShieldCheck } from "lucide-react";

const sections = [
  "Client",
  "Referral Source",
  "Referral Details",
  "Insurance",
  "Services",
  "Accessibility",
  "Documents",
  "Consent",
];

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
      {children} {required && <span className="text-rosewood">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-rosewood focus:ring-2 focus:ring-rosewood/20 ${props.className ?? ""}`}
    />
  );
}

function Select({ children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...rest}
      className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
    >
      {children}
    </select>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
    />
  );
}

function Field({
  label,
  required,
  children,
  span,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  span?: "full" | "half";
}) {
  return (
    <div className={span === "full" ? "sm:col-span-2" : ""}>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

function SectionCard({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`section-${index}`}
      className="scroll-mt-28 rounded-3xl border border-border/70 bg-card p-8 shadow-soft md:p-10"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-rosewood text-sm font-medium text-rosewood-foreground">
          {index}
        </span>
        <div>
          <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

const serviceOptions = [
  "Care Coordination",
  "Housing Navigation",
  "Family Support",
  "Community Support",
  "Resource Navigation",
  "Behavioral Health Support",
  "Benefits Assistance",
  "Documentation Assistance",
  "Virtual Support",
  "Other",
];

export function ReferralForm() {
  const [submitted, setSubmitted] = useState(false);
  const [under18, setUnder18] = useState(false);
  const [safety, setSafety] = useState("No");
  const [consents, setConsents] = useState({ a: false, b: false, c: false });

  const allConsented = consents.a && consents.b && consents.c;

  if (submitted) {
    return (
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-border/70 bg-card p-10 text-center shadow-luxe md:p-16">
            <CheckCircle2 className="mx-auto h-12 w-12 text-rosewood" strokeWidth={1.5} />
            <h2 className="mt-6 font-display text-3xl md:text-4xl">
              Thank you. Your referral has been received.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Your referral is currently under review. A member of our team will
              follow up regarding next steps.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* SMS consent banner */}
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-border/70 bg-accent/40 p-5 text-sm text-foreground/80">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-rosewood" strokeWidth={1.5} />
          <p>
            By submitting this form, you agree that LuxeNova Community Wellness
            may contact you by phone, email, or text regarding this referral.
            Message and data rates may apply. You may opt out of text messages
            at any time by replying STOP.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Progress sidebar */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Form Sections
              </p>
              <ol className="mt-4 space-y-3">
                {sections.map((s, i) => (
                  <li key={s}>
                    <a
                      href={`#section-${i + 1}`}
                      className="flex items-center gap-3 text-sm text-foreground/80 transition hover:text-rosewood"
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full border border-border text-[11px] text-muted-foreground">
                        {i + 1}
                      </span>
                      {s}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <form
            className="space-y-8 lg:col-span-9"
            onSubmit={(e) => {
              e.preventDefault();
              if (!allConsented) return;
              setSubmitted(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {/* SECTION 1 */}
            <SectionCard index={1} title="Client Information">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Client First Name" required>
                  <Input name="firstName" required />
                </Field>
                <Field label="Client Last Name" required>
                  <Input name="lastName" required />
                </Field>
                <Field label="Preferred Name">
                  <Input name="preferredName" />
                </Field>
                <Field label="Date of Birth">
                  <Input name="dob" type="date" />
                </Field>
                <Field label="Phone Number">
                  <Input name="phone" type="tel" />
                </Field>
                <Field label="Email Address">
                  <Input name="email" type="email" />
                </Field>
                <Field label="Full Address" span="full">
                  <Input name="address" />
                </Field>
                <Field label="City">
                  <Input name="city" />
                </Field>
                <Field label="State">
                  <Input name="state" />
                </Field>
                <Field label="ZIP Code">
                  <Input name="zip" />
                </Field>
                <Field label="Gender">
                  <Select name="gender" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer to self-describe</option>
                    <option>Prefer not to say</option>
                  </Select>
                </Field>
                <Field label="Preferred Language">
                  <Input name="language" placeholder="English, Spanish, …" />
                </Field>
                <Field label="Is client under 18?" span="full">
                  <div className="mt-2 flex gap-2">
                    {["No", "Yes"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setUnder18(v === "Yes")}
                        className={`rounded-full border px-5 py-2 text-sm transition ${
                          (v === "Yes") === under18
                            ? "border-rosewood bg-rosewood text-rosewood-foreground"
                            : "border-border bg-background text-foreground/80 hover:border-foreground/30"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </Field>
                {under18 && (
                  <>
                    <Field label="Parent / Guardian Name">
                      <Input name="guardianName" />
                    </Field>
                    <Field label="Parent / Guardian Phone">
                      <Input name="guardianPhone" type="tel" />
                    </Field>
                  </>
                )}
              </div>
            </SectionCard>

            {/* SECTION 2 */}
            <SectionCard index={2} title="Referral Source Information">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Referring Organization" span="full">
                  <Input name="refOrg" />
                </Field>
                <Field label="Referring Contact Name">
                  <Input name="refName" />
                </Field>
                <Field label="Relationship to Client">
                  <Input name="refRelationship" />
                </Field>
                <Field label="Referring Contact Phone">
                  <Input name="refPhone" type="tel" />
                </Field>
                <Field label="Referring Contact Email">
                  <Input name="refEmail" type="email" />
                </Field>
                <Field label="Best Method of Contact" span="full">
                  <Select name="refMethod" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>Text</option>
                  </Select>
                </Field>
              </div>
            </SectionCard>

            {/* SECTION 3 */}
            <SectionCard index={3} title="Referral Details">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Main Reason for Referral" span="full">
                  <Textarea name="reason" rows={3} />
                </Field>
                <Field label="Current Challenges or Concerns" span="full">
                  <Textarea name="challenges" rows={3} />
                </Field>
                <Field label="Requested Services" span="full">
                  <Textarea name="requested" rows={2} />
                </Field>
                <Field label="Urgency Level">
                  <Select name="urgency" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Routine</option>
                    <option>Priority</option>
                    <option>Urgent</option>
                  </Select>
                </Field>
                <Field label="Immediate Safety Concern?">
                  <Select
                    name="safety"
                    value={safety}
                    onChange={(e) => setSafety(e.target.value)}
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </Select>
                </Field>
                {safety === "Yes" && (
                  <Field label="Please explain the safety concern" span="full">
                    <Textarea name="safetyDetails" rows={3} />
                  </Field>
                )}
              </div>
            </SectionCard>

            {/* SECTION 4 */}
            <SectionCard index={4} title="Insurance & Care Information">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Insurance Provider">
                  <Input name="insProvider" />
                </Field>
                <Field label="Insurance ID / Policy Number">
                  <Input name="insId" />
                </Field>
                <Field label="MassHealth ID (if applicable)">
                  <Input name="masshealthId" />
                </Field>
                <Field label="Primary Care Provider">
                  <Input name="pcp" />
                </Field>
                <Field label="Current Behavioral Health Provider">
                  <Input name="bhProvider" />
                </Field>
                <Field label="Current Case Manager">
                  <Input name="caseManager" />
                </Field>
                <Field label="Current Agency Involved" span="full">
                  <Input name="currentAgency" />
                </Field>
              </div>
            </SectionCard>

            {/* SECTION 5 */}
            <SectionCard
              index={5}
              title="Requested Support Services"
              description="Select all that apply."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground/85 transition hover:border-rosewood/40"
                  >
                    <input
                      type="checkbox"
                      name="services"
                      value={s}
                      className="h-4 w-4 accent-[var(--rosewood)]"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </SectionCard>

            {/* SECTION 6 */}
            <SectionCard index={6} title="Accessibility & Preferences">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Disability or Accessibility Needs" span="full">
                  <Textarea name="accessibility" rows={2} />
                </Field>
                <Field label="Transportation Needs" span="full">
                  <Textarea name="transportation" rows={2} />
                </Field>
                <Field label="Preferred Service Type">
                  <Select name="serviceType" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Virtual</option>
                    <option>In-Person</option>
                    <option>Hybrid</option>
                  </Select>
                </Field>
                <Field label="Preferred Contact Method">
                  <Select name="contactMethod" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>Text</option>
                  </Select>
                </Field>
                <Field label="Best Time to Contact Client" span="full">
                  <Input name="bestTime" placeholder="e.g. weekdays after 5pm" />
                </Field>
              </div>
            </SectionCard>

            {/* SECTION 7 */}
            <SectionCard
              index={7}
              title="Upload Documents"
              description="Insurance cards, referral documents, assessments, consent forms, supporting documentation."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Insurance Cards",
                  "Referral Documents",
                  "Assessments",
                  "Consent Forms",
                  "Supporting Documentation",
                ].map((label) => (
                  <label
                    key={label}
                    className="group flex cursor-pointer flex-col items-start gap-2 rounded-2xl border border-dashed border-border bg-background p-5 text-sm transition hover:border-rosewood/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-rosewood">
                        <Upload className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span className="font-medium text-foreground">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Click to upload · PDF, JPG, PNG
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </SectionCard>

            {/* SECTION 8 */}
            <SectionCard index={8} title="Consent & Submission">
              <div className="space-y-3">
                {[
                  {
                    key: "a" as const,
                    label:
                      "I confirm the information provided is accurate to the best of my knowledge.",
                  },
                  {
                    key: "b" as const,
                    label:
                      "I understand that submitting a referral does not guarantee immediate acceptance into services.",
                  },
                  {
                    key: "c" as const,
                    label:
                      "I acknowledge LuxeNova Community Wellness may contact the client or referral source regarding this referral.",
                  },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background p-4 text-sm text-foreground/85 transition hover:border-rosewood/40"
                  >
                    <input
                      type="checkbox"
                      checked={consents[key]}
                      onChange={(e) =>
                        setConsents((c) => ({ ...c, [key]: e.target.checked }))
                      }
                      className="mt-0.5 h-4 w-4 accent-[var(--rosewood)]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  All submissions are encrypted in transit.
                </p>
                <button
                  type="submit"
                  disabled={!allConsented}
                  className="inline-flex items-center rounded-full bg-gradient-rosewood px-8 py-3.5 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Referral
                </button>
              </div>
            </SectionCard>
          </form>
        </div>
      </div>
    </section>
  );
}
