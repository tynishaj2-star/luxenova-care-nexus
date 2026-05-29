import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { Phone, Mail, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { notifyStaff } from "@/lib/notify-staff";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Contact LuxeNova Community Wellness for general inquiries, referrals, partnerships, or career questions.",
      },
      { property: "og:title", content: "Contact LuxeNova" },
      {
        property: "og:description",
        content:
          "Reach our team for inquiries, referrals, partnerships, or careers.",
      },
    ],
  }),
  component: ContactPage,
});

const inquiryTypes = [
  "General Inquiry",
  "Referral Assistance",
  "Partnership Inquiry",
  "Career Inquiry",
];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Contact"
          title="We're here to help."
          description="Reach out for general questions, referrals, partnerships, or career opportunities. We respond within one business day."
        />

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-10 lg:grid-cols-12">
              <aside className="lg:col-span-4">
                <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <h3 className="font-display text-xl">Reach our team</h3>
                  <ul className="mt-5 space-y-4 text-sm text-foreground/85">
                    <li className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 text-rosewood" />
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-[0.14em]">Phone</p>
                        <a href="tel:+18665663146" className="hover:text-rosewood transition-colors">
                          (866) 566-3146
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 text-rosewood" />
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-[0.14em]">Email</p>
                        <a href="mailto:tjohnson@luxenovawellnesscommunity.com" className="hover:text-rosewood transition-colors break-all">
                          tjohnson@luxenovawellnesscommunity.com
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-rosewood" />
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-[0.14em]">Service Area</p>
                        <p>Greater Boston · Statewide Massachusetts</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-border/70 bg-accent/40 p-5 text-xs text-foreground/75">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-rosewood" strokeWidth={1.5} />
                  <p>
                    Confidentiality note: please do not include sensitive
                    household details in general email or text messages. For
                    confidential information, use our Request Help form.
                  </p>
                </div>
              </aside>

              <div className="lg:col-span-8">
                <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-luxe md:p-10">
                  {submitted ? (
                    <div className="py-10 text-center">
                      <CheckCircle2 className="mx-auto h-12 w-12 text-rosewood" strokeWidth={1.5} />
                      <h3 className="mt-5 font-display text-2xl">Thank you — message received.</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        A member of our team will respond within one business day.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (submitting) return;
                        const form = e.currentTarget;
                        const fd = new FormData(form);
                        setSubmitting(true);
                        try {
                          await notifyStaff("Contact Form", [
                            { label: "Full Name", value: String(fd.get("name") || "") },
                            { label: "Email", value: String(fd.get("email") || "") },
                            { label: "Phone", value: String(fd.get("phone") || "") },
                            { label: "Inquiry Type", value: String(fd.get("inquiry_type") || "") },
                            { label: "Message", value: String(fd.get("message") || "") },
                          ]);
                          setSubmitted(true);
                        } catch (err) {
                          console.error(err);
                          toast.error("Couldn't send your message. Please try again or email us directly.");
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <FormField label="Full Name" required>
                        <input name="name" required className="form-input" />
                      </FormField>
                      <FormField label="Email" required>
                        <input name="email" required type="email" className="form-input" />
                      </FormField>
                      <FormField label="Phone">
                        <input name="phone" type="tel" className="form-input" />
                      </FormField>
                      <FormField label="Inquiry Type" required>
                        <select name="inquiry_type" required className="form-input" defaultValue="">
                          <option value="" disabled>Select…</option>
                          {inquiryTypes.map((i) => (
                            <option key={i}>{i}</option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Message" required span="full">
                        <textarea name="message" required rows={5} className="form-input min-h-[140px] py-3" />
                      </FormField>
                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center rounded-full bg-gradient-rosewood px-7 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:opacity-60"
                        >
                          {submitting ? "Sending…" : "Send Message"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
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
