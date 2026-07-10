import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Plus, Trash2, Backpack, Loader2 } from "lucide-react";

export const Route = createFileRoute("/back-to-school")({
  head: () => ({
    meta: [
      { title: "Back-to-School Supply Registration — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Register your family for back-to-school supplies through LuxeNova Community Wellness, Inc. Serving Massachusetts families for the 2026–2027 school year.",
      },
      { property: "og:title", content: "Back-to-School Supply Registration — LuxeNova Community Wellness, Inc." },
      { property: "og:description", content: "Massachusetts families in need of back-to-school supplies can register here." },
    ],
  }),
  component: BackToSchoolPage,
});

type Student = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  grade: string;
  school_name: string;
  backpack_needed: boolean;
  special_needs: string;
  shirt_size: string;
};

function emptyStudent(): Student {
  return {
    first_name: "",
    last_name: "",
    date_of_birth: "",
    grade: "",
    school_name: "",
    backpack_needed: false,
    special_needs: "",
    shirt_size: "",
  };
}

const HOUSING_OPTIONS = ["Permanent Housing", "Shelter", "Transitional Housing", "Homeless", "Other"];
const CONTACT_OPTIONS = ["Phone", "Email", "Text"];
const GRADE_OPTIONS = [
  "Pre-K", "Kindergarten",
  "1st", "2nd", "3rd", "4th", "5th",
  "6th", "7th", "8th",
  "9th", "10th", "11th", "12th",
];

function BackToSchoolPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const [form, setForm] = useState({
    parent_first_name: "",
    parent_last_name: "",
    email: "",
    phone: "",
    preferred_contact: "Phone",
    street_address: "",
    apartment: "",
    city: "",
    state: "Massachusetts",
    zip: "",
    adults_count: "",
    children_count: "",
    snap: false,
    wic: false,
    masshealth: false,
    housing_status: "",
    additional_info: "",
    agree_accurate: false,
    agree_no_guarantee: false,
    agree_contact: false,
  });
  const [students, setStudents] = useState<Student[]>([emptyStudent()]);

  function up<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function upStudent(i: number, patch: Partial<Student>) {
    setStudents((s) => s.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (honeypot) return; // bot trap

    if (!form.agree_accurate || !form.agree_no_guarantee || !form.agree_contact) {
      setError("Please review and accept all three agreements below.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: reg, error: regErr } = await supabase
        .from("back_to_school_registrations")
        .insert({
          parent_first_name: form.parent_first_name.trim(),
          parent_last_name: form.parent_last_name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim(),
          preferred_contact: form.preferred_contact,
          street_address: form.street_address.trim(),
          apartment: form.apartment.trim() || null,
          city: form.city.trim() || null,
          state: form.state.trim() || "Massachusetts",
          zip: form.zip.trim() || null,
          adults_count: form.adults_count ? Number(form.adults_count) : null,
          children_count: form.children_count ? Number(form.children_count) : null,
          snap: form.snap,
          wic: form.wic,
          masshealth: form.masshealth,
          housing_status: form.housing_status || null,
          additional_info: form.additional_info.trim() || null,
          agree_accurate: form.agree_accurate,
          agree_no_guarantee: form.agree_no_guarantee,
          agree_contact: form.agree_contact,
        })
        .select("id")
        .single();

      if (regErr || !reg) throw regErr || new Error("Registration failed");

      const validStudents = students.filter((s) => s.first_name.trim() || s.last_name.trim());
      if (validStudents.length > 0) {
        const { error: studentErr } = await supabase
          .from("back_to_school_students")
          .insert(
            validStudents.map((s) => ({
              registration_id: reg.id,
              first_name: s.first_name.trim(),
              last_name: s.last_name.trim(),
              date_of_birth: s.date_of_birth || null,
              grade: s.grade || null,
              school_name: s.school_name.trim() || null,
              backpack_needed: s.backpack_needed,
              special_needs: s.special_needs.trim() || null,
              shirt_size: s.shirt_size.trim() || null,
            })),
          );
        if (studentErr) throw studentErr;
      }

      // Notify staff via existing endpoint (best-effort, non-blocking failure)
      try {
        await fetch("/api/public/notify-staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formName: "Back-to-School Registration",
            fields: [
              { label: "Parent/Guardian", value: `${form.parent_first_name} ${form.parent_last_name}` },
              { label: "Email", value: form.email },
              { label: "Phone", value: form.phone },
              { label: "Preferred Contact", value: form.preferred_contact },
              { label: "Address", value: `${form.street_address}${form.apartment ? ", Apt " + form.apartment : ""}, ${form.city}, ${form.state} ${form.zip}` },
              { label: "Housing Status", value: form.housing_status },
              { label: "Household", value: `${form.adults_count || 0} adults, ${form.children_count || 0} children` },
              { label: "Benefits", value: [form.snap && "SNAP", form.wic && "WIC", form.masshealth && "MassHealth"].filter(Boolean).join(", ") || "None" },
              { label: "Students", value: validStudents.map((s) => `${s.first_name} ${s.last_name} (Grade ${s.grade || "?"}${s.backpack_needed ? " · backpack" : ""})`).join("; ") || "None listed" },
              { label: "Additional Info", value: form.additional_info || "" },
            ],
          }),
        });
      } catch {
        // ignore — registration is already saved
      }

      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-warm" />
          <div className="pointer-events-none absolute -top-32 -right-40 h-[420px] w-[420px] rounded-full bg-rosewood/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-rosewood">
              <Backpack className="h-3.5 w-3.5" strokeWidth={1.75} /> 2026–2027 School Year
            </div>
            <h1 className="mt-5 font-display text-4xl text-balance md:text-6xl">
              🎒 Back-to-School Supply Registration
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
              LuxeNova Community Wellness, Inc. is committed to helping students start the
              school year prepared for success. Families in need of school supplies may
              complete the registration form below. Completing this form does not guarantee
              assistance. Supplies will be distributed based on available inventory and
              eligibility.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-3xl px-6">
            {done ? (
              <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-luxe text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" strokeWidth={1.5} />
                <h2 className="mt-4 font-display text-3xl">Thank you!</h2>
                <p className="mt-3 text-muted-foreground">
                  Your registration has been received. A member of our team will
                  contact you using your preferred method as supplies are prepared
                  for distribution. If your situation changes, please reach out to
                  us directly.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-8">
                {/* Honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                <Section title="Parent / Guardian Information">
                  <Grid2>
                    <Field label="First Name" required>
                      <input required value={form.parent_first_name} onChange={(e) => up("parent_first_name", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Last Name" required>
                      <input required value={form.parent_last_name} onChange={(e) => up("parent_last_name", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Email Address">
                      <input type="email" value={form.email} onChange={(e) => up("email", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Phone Number" required>
                      <input required type="tel" value={form.phone} onChange={(e) => up("phone", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Preferred Contact Method">
                      <select value={form.preferred_contact} onChange={(e) => up("preferred_contact", e.target.value)} className={inp}>
                        {CONTACT_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </Grid2>
                </Section>

                <Section title="Home Address">
                  <Grid2>
                    <Field label="Street Address" required span={2}>
                      <input required value={form.street_address} onChange={(e) => up("street_address", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Apartment Number">
                      <input value={form.apartment} onChange={(e) => up("apartment", e.target.value)} className={inp} />
                    </Field>
                    <Field label="City">
                      <input value={form.city} onChange={(e) => up("city", e.target.value)} className={inp} />
                    </Field>
                    <Field label="State">
                      <input value={form.state} onChange={(e) => up("state", e.target.value)} className={inp} />
                    </Field>
                    <Field label="ZIP Code">
                      <input value={form.zip} onChange={(e) => up("zip", e.target.value)} className={inp} inputMode="numeric" />
                    </Field>
                  </Grid2>
                </Section>

                <Section title="Household Information">
                  <Grid2>
                    <Field label="Number of Adults">
                      <input type="number" min={0} value={form.adults_count} onChange={(e) => up("adults_count", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Number of Children">
                      <input type="number" min={0} value={form.children_count} onChange={(e) => up("children_count", e.target.value)} className={inp} />
                    </Field>
                  </Grid2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <YesNo label="Receiving SNAP?" value={form.snap} onChange={(v) => up("snap", v)} />
                    <YesNo label="Receiving WIC?" value={form.wic} onChange={(v) => up("wic", v)} />
                    <YesNo label="MassHealth / Medicaid?" value={form.masshealth} onChange={(v) => up("masshealth", v)} />
                  </div>
                  <div className="mt-4">
                    <Field label="Housing Status">
                      <select value={form.housing_status} onChange={(e) => up("housing_status", e.target.value)} className={inp}>
                        <option value="">Select…</option>
                        {HOUSING_OPTIONS.map((h) => <option key={h}>{h}</option>)}
                      </select>
                    </Field>
                  </div>
                </Section>

                <Section title="Student Information" subtitle="Add each child needing supplies.">
                  <div className="space-y-5">
                    {students.map((s, i) => (
                      <div key={i} className="rounded-2xl border border-border/70 bg-background/50 p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-medium">Child {i + 1}</h3>
                          {students.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setStudents((arr) => arr.filter((_, idx) => idx !== i))}
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                              aria-label={`Remove child ${i + 1}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          )}
                        </div>
                        <Grid2>
                          <Field label="First Name">
                            <input value={s.first_name} onChange={(e) => upStudent(i, { first_name: e.target.value })} className={inp} />
                          </Field>
                          <Field label="Last Name">
                            <input value={s.last_name} onChange={(e) => upStudent(i, { last_name: e.target.value })} className={inp} />
                          </Field>
                          <Field label="Date of Birth">
                            <input type="date" value={s.date_of_birth} onChange={(e) => upStudent(i, { date_of_birth: e.target.value })} className={inp} />
                          </Field>
                          <Field label="Grade (2026–2027)">
                            <select value={s.grade} onChange={(e) => upStudent(i, { grade: e.target.value })} className={inp}>
                              <option value="">Select…</option>
                              {GRADE_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                            </select>
                          </Field>
                          <Field label="School Name" span={2}>
                            <input value={s.school_name} onChange={(e) => upStudent(i, { school_name: e.target.value })} className={inp} />
                          </Field>
                          <Field label="Shirt Size (Optional)">
                            <input value={s.shirt_size} onChange={(e) => upStudent(i, { shirt_size: e.target.value })} className={inp} placeholder="e.g. Youth M" />
                          </Field>
                          <div className="flex items-end">
                            <label className="inline-flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={s.backpack_needed} onChange={(e) => upStudent(i, { backpack_needed: e.target.checked })} />
                              Backpack needed
                            </label>
                          </div>
                          <Field label="Special School Supply Needs" span={2}>
                            <textarea rows={2} value={s.special_needs} onChange={(e) => upStudent(i, { special_needs: e.target.value })} className={inp} />
                          </Field>
                        </Grid2>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setStudents((s) => [...s, emptyStudent()])}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-foreground/30"
                    >
                      <Plus className="h-4 w-4" /> Add another child
                    </button>
                  </div>
                </Section>

                <Section title="Additional Information">
                  <Field label="Anything else you would like us to know?">
                    <textarea rows={4} value={form.additional_info} onChange={(e) => up("additional_info", e.target.value)} className={inp} />
                  </Field>
                </Section>

                <Section title="Required Agreements">
                  <div className="space-y-3">
                    <Agree checked={form.agree_accurate} onChange={(v) => up("agree_accurate", v)}>
                      I certify that the information provided is accurate.
                    </Agree>
                    <Agree checked={form.agree_no_guarantee} onChange={(v) => up("agree_no_guarantee", v)}>
                      I understand that completing this registration does not guarantee assistance
                      and supplies are distributed based on availability.
                    </Agree>
                    <Agree checked={form.agree_contact} onChange={(v) => up("agree_contact", v)}>
                      I agree to be contacted by LuxeNova Community Wellness, Inc. regarding this registration.
                    </Agree>
                  </div>
                </Section>

                {error && (
                  <div role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-luxe transition hover:bg-emerald-700 disabled:opacity-70"
                >
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Registration"}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  This form is secured with rate limiting and abuse protection. Your
                  information is confidential and used only for supply distribution.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosewood/40";

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 md:p-8 shadow-soft">
      <div className="mb-5">
        <h2 className="font-display text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, required, span, children }: { label: string; required?: boolean; span?: 1 | 2; children: React.ReactNode }) {
  return (
    <label className={`grid gap-1.5 ${span === 2 ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {label}{required && <span className="text-rosewood"> *</span>}
      </span>
      {children}
    </label>
  );
}

function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2.5">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <div className="mt-2 flex gap-4 text-sm">
        <label className="inline-flex items-center gap-1.5">
          <input type="radio" checked={value === true} onChange={() => onChange(true)} /> Yes
        </label>
        <label className="inline-flex items-center gap-1.5">
          <input type="radio" checked={value === false} onChange={() => onChange(false)} /> No
        </label>
      </div>
    </div>
  );
}

function Agree({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4"
        required
      />
      <span>{children}</span>
    </label>
  );
}
