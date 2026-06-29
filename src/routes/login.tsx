import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Lock, Mail, ShieldCheck, ArrowRight, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

type Mode = "signin" | "forgot";

const searchSchema = z.object({
  redirect: z.string().optional().default("/portal"),
  mode: z.enum(["signin", "forgot"]).optional().default("signin"),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign In — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Secure sign-in for LuxeNova Community Wellness, Inc. staff, board, and community partners.",
      },
    ],
  }),
  component: LoginPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

const emailOnlySchema = z.object({
  email: z.string().trim().email().max(255),
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>(search.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: search.redirect as "/portal" });
    }
  }, [user, loading, navigate, search.redirect]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "forgot") {
      const parsed = emailOnlySchema.safeParse({ email });
      if (!parsed.success) {
        setError("Please enter a valid email.");
        return;
      }
      setBusy(true);
      try {
        const { error: e } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (e) throw e;
        setInfo("If an account exists for that email, a reset link is on its way.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send reset email.");
      } finally {
        setBusy(false);
      }
      return;
    }

    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setBusy(true);
    try {
      const { error: e } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (e) throw e;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + (search.redirect || "/portal"),
      });
      if (result.error) {
        setError(result.error.message ?? "Google sign-in failed");
        setBusy(false);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-rosewood text-rosewood-foreground font-display">
            L
          </span>
          <span className="font-display text-lg">LuxeNova Community Wellness, Inc.</span>
        </Link>
        <Link
          to="/"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-soft transition hover:border-foreground/30"
        >
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-8 lg:grid-cols-2 lg:items-center">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Secure Sign In</p>
          <h1 className="font-display text-4xl md:text-5xl text-balance">
            One sign-in for staff, board, and community partners.
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Admins and staff land on the internal dashboard. Community
            partners — clinicians, school staff, faith leaders, shelters —
            land on the referral workspace. Same sign-in, the right view
            for your role.
          </p>
          <ul className="space-y-3 pt-2 text-sm">
            {[
              "Encrypted in transit (TLS 1.2+) · HIPAA-aware intake",
              "Role-aware: staff see the admin dashboard, partners see referrals",
              "Invited employees are prompted to set a new password on first sign-in",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-foreground/85">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-rosewood" strokeWidth={1.5} />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-luxe md:p-10">
            <div className="mb-6 inline-flex rounded-full border border-border bg-background p-1">
              {(["signin", "forgot"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setError(null); setInfo(null); }}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    mode === m
                      ? "bg-rosewood text-rosewood-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "signin" ? "Sign in" : "Forgot password"}
                </button>
              ))}
            </div>

            <h2 className="font-display text-2xl">
              {mode === "signin" ? "Welcome back" : "Reset your password"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in with your staff or partner credentials — we'll route you to the right dashboard."
                : "We'll email you a secure link to choose a new password."}
            </p>

            {mode === "signin" && (
              <>
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={busy}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-soft transition hover:border-foreground/30 disabled:opacity-50"
                >
                  <GoogleIcon /> Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or with email
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@organization.org"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </Field>

              {mode === "signin" && (
                <Field label="Password">
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="current-password"
                      placeholder="At least 8 characters"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </Field>
              )}

              {error && (
                <p className="rounded-xl border border-rosewood/30 bg-accent/40 px-3 py-2 text-xs text-rosewood">
                  {error}
                </p>
              )}
              {info && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  {info}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:opacity-50"
              >
                {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Send reset link"}
                {mode === "signin"
                  ? <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  : <KeyRound className="h-4 w-4" strokeWidth={1.5} />}
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-border/70 bg-background px-4 py-3 text-xs text-muted-foreground">
              <strong className="block text-foreground">Invite-only access</strong>
              Staff and partner accounts are created by a LuxeNova Community
              Wellness, Inc. admin. Contact us at{" "}
              <a href="mailto:tjohnson@luxenovacommunitywellness.com" className="text-rosewood underline">
                tjohnson@luxenovacommunitywellness.com
              </a>{" "}
              to request access.
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/terms" className="underline hover:text-rosewood">Terms</Link>,{" "}
              <Link to="/privacy" className="underline hover:text-rosewood">Privacy Policy</Link>, and{" "}
              <Link to="/hipaa" className="underline hover:text-rosewood">Confidentiality Notice</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-rosewood focus:ring-2 focus:ring-rosewood/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.8 6.3 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.8 6.3 29.2 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.7 13.3-4.7l-6.1-5c-2.1 1.4-4.6 2.2-7.2 2.2-5.3 0-9.7-3.1-11.3-7.5L6 33.3C9.4 39.2 16.1 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.1 5C40.7 35.8 43.5 30.3 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
    </svg>
  );
}

export function requireSignedOutRedirect() {
  throw redirect({ to: "/portal" });
}
