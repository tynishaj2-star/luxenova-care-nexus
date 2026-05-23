import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ContentSection, CardGrid, CalloutNote } from "@/components/site/ContentPage";
import { Apple, HandHeart, Users, Building2, CheckCircle2, Drumstick, Gift, Snowflake, Sparkles } from "lucide-react";

export const Route = createFileRoute("/food-drives")({
  head: () => ({
    meta: [
      { title: "Food Drives — LuxeNova Community Wellness" },
      {
        name: "description",
        content:
          "Host a food drive, volunteer, donate essentials, or request food and household support through LuxeNova Community Wellness.",
      },
      { property: "og:title", content: "Food Drives — LuxeNova Community Wellness" },
      {
        property: "og:description",
        content:
          "Food drive hosting, volunteering, donations, and family essentials support across Massachusetts.",
      },
    ],
  }),
  component: FoodDrivesPage,
});

const ways = [
  {
    icon: Apple,
    title: "Host a food drive",
    body: "Partner with LuxeNova to organize a drive at your church, school, business, or community space.",
  },
  {
    icon: HandHeart,
    title: "Volunteer at a drive",
    body: "Help with intake, sorting, packing, and distribution to families across the service area.",
  },
  {
    icon: Users,
    title: "Donate food or essentials",
    body: "Contribute non-perishable food, baby items, hygiene products, and household essentials.",
  },
  {
    icon: Building2,
    title: "Request support",
    body: "Families in need can request food, baby items, and household essentials through the form below.",
  },
];

const INTERESTS = [
  "Hosting a food drive",
  "Volunteering at a food drive",
  "Donating food or essentials",
  "Requesting food or essentials support",
  "Partnering as a church, school, business, or community group",
];

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  interest: string;
  organization: string;
  timeframe: string;
  city: string;
  items: string;
  message: string;
};

const initial: FormState = {
  fullName: "",
  phone: "",
  email: "",
  interest: INTERESTS[0],
  organization: "",
  timeframe: "",
  city: "",
  items: "",
  message: "",
};

function FoodDrivesPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Required";
    if (!form.phone.trim() && !form.email.trim())
      nextErrors.email = "Provide phone or email";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      nextErrors.email = "Enter a valid email";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    try {
      const { notifyStaff } = await import("@/lib/notify-staff");
      await notifyStaff("Food Drive Interest Form", [
        { label: "Full Name", value: form.fullName },
        { label: "Phone", value: form.phone },
        { label: "Email", value: form.email },
        { label: "Interest", value: form.interest },
        { label: "Organization", value: form.organization },
        { label: "Preferred Date/Timeframe", value: form.timeframe },
        { label: "City", value: form.city },
        { label: "Items to Donate / Request", value: form.items },
        { label: "Message", value: form.message },
      ]);
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Food Drives"
          title="Feed neighbors. Stabilize families."
          description="Food drives, volunteer days, essentials donations, and direct family support — coordinated with dignity across Massachusetts."
        />

        <CardGrid items={ways} columns={4} />

        <section className="pb-8">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.22em] text-rosewood/80">
                  Seasonal Programs
                </p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
                  Holiday Drives
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Each year LuxeNova Community Wellness organizes seasonal
                  drives so families across our service area can experience
                  the warmth, dignity, and joy of the holidays.
                </p>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Host, sponsor, or contribute to a holiday drive using the
                interest form below — select the drive you'd like to
                support.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Drumstick,
                  season: "November",
                  title: "Thanksgiving Drive",
                  body: "Full Thanksgiving meal boxes — turkey, sides, and pantry staples — distributed to families ahead of the holiday.",
                },
                {
                  icon: Gift,
                  season: "December",
                  title: "Christmas Toy & Gift Drive",
                  body: "New, unwrapped toys and gifts for children and teens, paired with family essentials and seasonal joy.",
                },
                {
                  icon: Snowflake,
                  season: "December – February",
                  title: "Winter Warmth Drive",
                  body: "Coats, hats, gloves, blankets, and heating essentials for households facing the coldest months.",
                },
                {
                  icon: Sparkles,
                  season: "Year-Round Holidays",
                  title: "Easter, Back-to-School & More",
                  body: "Seasonal baskets, school supply giveaways, and Mother's / Father's Day appreciation drives throughout the year.",
                },
              ].map((h) => (
                <article
                  key={h.title}
                  className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rosewood/30 hover:shadow-luxe"
                >
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-rosewood/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-rosewood transition-colors group-hover:bg-rosewood group-hover:text-rosewood-foreground">
                    <h.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-rosewood/80">
                    {h.season}
                  </p>
                  <h3 className="mt-2 font-display text-xl">{h.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {h.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft md:p-10">
              <p className="text-xs uppercase tracking-[0.22em] text-rosewood/80">
                Food Drive Interest Form
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">
                Food Drive Interest Form
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Use this form to host a food drive, volunteer for a drive,
                donate food or essentials, or request food and household
                essentials support.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-rosewood/30 bg-accent/40 p-6 text-sm leading-relaxed text-foreground/85">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-rosewood" />
                    <p>
                      Thank you. Your food drive interest form has been
                      received. LuxeNova will review the information and
                      follow up regarding next steps.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required>
                    <Input
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      maxLength={120}
                    />
                    {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
                  </Field>
                  <Field label="Phone Number">
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      maxLength={30}
                    />
                  </Field>
                  <Field label="Email Address" span="full">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      maxLength={255}
                    />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                  </Field>
                  <Field label="I am interested in" span="full" required>
                    <Select
                      value={form.interest}
                      onChange={(e) => set("interest", e.target.value)}
                    >
                      {INTERESTS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Organization / Group Name (if applicable)" span="full">
                    <Input
                      value={form.organization}
                      onChange={(e) => set("organization", e.target.value)}
                      maxLength={160}
                    />
                  </Field>
                  <Field label="Preferred Date or Timeframe">
                    <Input
                      value={form.timeframe}
                      onChange={(e) => set("timeframe", e.target.value)}
                      placeholder="e.g. Saturday Nov 15, or late November"
                      maxLength={120}
                    />
                  </Field>
                  <Field label="City / Service Area">
                    <Input
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      maxLength={120}
                    />
                  </Field>
                  <Field label="Items Available or Needed" span="full">
                    <Textarea
                      rows={3}
                      value={form.items}
                      onChange={(e) => set("items", e.target.value)}
                      maxLength={800}
                      placeholder="Canned goods, baby formula, diapers, hygiene items, etc."
                    />
                  </Field>
                  <Field label="Message" span="full">
                    <Textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      maxLength={1500}
                      placeholder="Anything else we should know."
                    />
                  </Field>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-rosewood px-7 text-sm font-medium text-rosewood-foreground shadow-soft transition hover:opacity-95"
                    >
                      Submit Food Drive Interest
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <ContentSection title="What we collect at most drives">
          <p>
            Non-perishable food, baby items, diapers and wipes, hygiene
            products, household essentials, school supplies (seasonal),
            and warm-weather items (seasonal). Specific drive needs are
            published per event.
          </p>
        </ContentSection>

        <CalloutNote>
          LuxeNova Community Wellness coordinates food drives in
          partnership with churches, schools, businesses, and community
          groups. We honor dignity at every step — for donors,
          volunteers, and families receiving support.
        </CalloutNote>
      </main>
      <Footer />
    </div>
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
      <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label} {required && <span className="text-rosewood">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
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

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-rosewood">{children}</p>;
}
