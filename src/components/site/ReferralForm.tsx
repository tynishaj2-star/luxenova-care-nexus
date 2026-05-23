import { useState } from "react";
import { CheckCircle2, Upload, ShieldCheck } from "lucide-react";

const sections = [
  "Household",
  "Request Source",
  "Urgent Need",
  "Stabilization Details",
  "Support Areas",
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

const supportOptions = [
  "Emergency Rental Assistance",
  "Utility Relief",
  "Autism Family Support",
  "Community Stabilization",
  "Resource Navigation",
  "Documentation Assistance",
  "Community Outreach",
  "Sponsor / Donor Match",
  "Other",
];

const uploadCategories = [
  "Rent Notice / Lease",
  "Utility Bill / Shutoff Notice",
  "Autism Support Documents",
  "Income or Benefit Documents",
  "School / Agency Letter",
  "Supporting Documentation",
];

export function ReferralForm() {
  const [submitted, setSubmitted] = useState(false);
  const [autismHousehold, setAutismHousehold] = useState(false);
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
              Thank you. Your request has been received.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Our team will review the information provided and follow up
              regarding next steps. Please keep any rent notices, shutoff
              notices, bills, leases, or support documents available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-border/70 bg-accent/40 p-5 text-sm text-foreground/80">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-rosewood" strokeWidth={1.5} />
          <p>
            This is a confidential community stabilization request. By submitting
            this form, you agree that LuxeNova Community Wellness may contact you
            by phone, email, or text regarding this request. Message and data
            rates may apply. You may opt out of text messages at any time by
            replying STOP.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
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
            {/* SECTION 1 — Family / Household */}
            <SectionCard index={1} title="Family / Household Information">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Head of Household — First Name" required>
                  <Input name="firstName" required />
                </Field>
                <Field label="Head of Household — Last Name" required>
                  <Input name="lastName" required />
                </Field>
                <Field label="Phone Number">
                  <Input name="phone" type="tel" />
                </Field>
                <Field label="Email Address">
                  <Input name="email" type="email" />
                </Field>
                <Field label="Home Address" span="full">
                  <Input name="address" />
                </Field>
                <Field label="City">
                  <Input name="city" />
                </Field>
                <Field label="State">
                  <Input name="state" defaultValue="MA" />
                </Field>
                <Field label="ZIP Code">
                  <Input name="zip" />
                </Field>
                <Field label="Household Size">
                  <Input name="householdSize" type="number" min={1} />
                </Field>
                <Field label="Children in Household">
                  <Input name="children" type="number" min={0} />
                </Field>
                <Field label="Preferred Language">
                  <Input name="language" placeholder="English, Spanish, …" />
                </Field>
                <Field label="Best Time to Contact">
                  <Input name="bestTime" placeholder="e.g. weekdays after 5pm" />
                </Field>
              </div>
            </SectionCard>

            {/* SECTION 2 — Request Source */}
            <SectionCard
              index={2}
              title="Request Source"
              description="Who is submitting this request? A family member, school, partner, or community contact."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Submitting on behalf of" span="full">
                  <Select name="onBehalf" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>The family / household themselves</option>
                    <option>School staff</option>
                    <option>Community partner / agency</option>
                    <option>Faith group</option>
                    <option>Shelter / housing partner</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Submitter Name">
                  <Input name="submitterName" />
                </Field>
                <Field label="Submitter Organization">
                  <Input name="submitterOrg" />
                </Field>
                <Field label="Submitter Phone">
                  <Input name="submitterPhone" type="tel" />
                </Field>
                <Field label="Submitter Email">
                  <Input name="submitterEmail" type="email" />
                </Field>
              </div>
            </SectionCard>

            {/* SECTION 3 — Urgent Need */}
            <SectionCard index={3} title="Urgent Need">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Primary Barrier" span="full">
                  <Select name="primaryBarrier" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Rent emergency / eviction risk</option>
                    <option>Utility shutoff notice</option>
                    <option>Autism family support gap</option>
                    <option>Food / essentials</option>
                    <option>Documentation / benefits</option>
                    <option>Multiple compounding barriers</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Describe the urgent need" span="full">
                  <Textarea name="urgentNeed" rows={3} />
                </Field>
                <Field label="Requested Amount (if known)">
                  <Input name="requestedAmount" placeholder="$" />
                </Field>
                <Field label="Deadline / Shutoff Date (if any)">
                  <Input name="deadline" type="date" />
                </Field>
                <Field label="Urgency Level">
                  <Select name="urgency" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Routine</option>
                    <option>Priority</option>
                    <option>Urgent — within days</option>
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
                  <Field label="Please describe the safety concern" span="full">
                    <Textarea name="safetyDetails" rows={3} />
                  </Field>
                )}
              </div>
            </SectionCard>

            {/* SECTION 4 — Stabilization Details */}
            <SectionCard index={4} title="Household & Stabilization Details">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Current Housing Situation">
                  <Select name="housing" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Renting</option>
                    <option>Living with family / doubled up</option>
                    <option>Shelter</option>
                    <option>Homeowner</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Monthly Household Income (approx.)">
                  <Input name="income" placeholder="$" />
                </Field>
                <Field label="Currently receiving benefits?">
                  <Select name="benefits" defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>None</option>
                    <option>SNAP</option>
                    <option>TAFDC / Cash Assistance</option>
                    <option>WIC</option>
                    <option>Section 8 / Housing Voucher</option>
                    <option>Multiple</option>
                  </Select>
                </Field>
                <Field label="Children's school or program">
                  <Input name="school" />
                </Field>
                <Field label="Autism family support needed?" span="full">
                  <div className="mt-2 flex gap-2">
                    {["No", "Yes"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAutismHousehold(v === "Yes")}
                        className={`rounded-full border px-5 py-2 text-sm transition ${
                          (v === "Yes") === autismHousehold
                            ? "border-rosewood bg-rosewood text-rosewood-foreground"
                            : "border-border bg-background text-foreground/80 hover:border-foreground/30"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </Field>
                {autismHousehold && (
                  <Field label="Briefly describe the autism support needed" span="full">
                    <Textarea name="autismDetails" rows={3} />
                  </Field>
                )}
                <Field label="Other relevant context" span="full">
                  <Textarea name="context" rows={3} />
                </Field>
              </div>
            </SectionCard>

            {/* SECTION 5 — Support Areas */}
            <SectionCard
              index={5}
              title="Support Areas"
              description="Select all that apply."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {supportOptions.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground/85 transition hover:border-rosewood/40"
                  >
                    <input
                      type="checkbox"
                      name="supportAreas"
                      value={s}
                      className="h-4 w-4 accent-[var(--rosewood)]"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </SectionCard>

            {/* SECTION 6 — Documents */}
            <SectionCard
              index={6}
              title="Upload Documents"
              description="Rent notices, utility bills, autism support documents, income or benefit documents, or supporting letters."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {uploadCategories.map((label) => (
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

            {/* SECTION 7 — Consent */}
            <SectionCard index={7} title="Consent & Submission">
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
                      "I understand that submitting this request does not guarantee specific financial relief or services.",
                  },
                  {
                    key: "c" as const,
                    label:
                      "I acknowledge LuxeNova Community Wellness may contact the family or submitter regarding this request and may coordinate with trusted community partners as appropriate.",
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
                  Submissions are confidential and encrypted in transit.
                </p>
                <button
                  type="submit"
                  disabled={!allConsented}
                  className="inline-flex items-center rounded-full bg-gradient-rosewood px-8 py-3.5 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Request
                </button>
              </div>
            </SectionCard>
          </form>
        </div>
      </div>
    </section>
  );
}
