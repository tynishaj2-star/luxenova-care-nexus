import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — LuxeNova Community Wellness, Inc." },
      {
        name: "description",
        content:
          "Set a new password for your LuxeNova Community Wellness, Inc. partner account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

const passwordSchema = z.string().min(8).max(128);

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase appends the recovery/invite session to the URL hash and the
  // client picks it up automatically. We just wait for a session to be
  // present before allowing the form to submit.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setHasSession(!!s);
      setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      setError("Password must be 8–128 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const { error: e } = await supabase.auth.updateUser({ password });
      if (e) throw e;
      setDone(true);
      setTimeout(() => navigate({ to: "/portal" }), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
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
      </header>

      <main className="mx-auto grid max-w-3xl px-6 pb-24 pt-8">
        <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-luxe md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-rosewood">Account security</p>
          <h1 className="mt-2 font-display text-3xl">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a strong password of at least 8 characters. We screen against
            known leaked password databases for your safety.
          </p>

          {!ready ? (
            <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
          ) : done ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Password updated. Redirecting to the portal…
            </div>
          ) : !hasSession ? (
            <div className="mt-8 space-y-4">
              <p className="rounded-xl border border-rosewood/30 bg-accent/40 px-3 py-2 text-sm text-rosewood">
                This page requires a valid invite or password-reset link. The
                link may have expired.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-sm"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">New password</span>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 pl-9 text-sm outline-none transition placeholder:text-muted-foreground focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Confirm password</span>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 pl-9 text-sm outline-none transition placeholder:text-muted-foreground focus:border-rosewood focus:ring-2 focus:ring-rosewood/20"
                  />
                </div>
              </label>

              {error && (
                <p className="rounded-xl border border-rosewood/30 bg-accent/40 px-3 py-2 text-xs text-rosewood">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-rosewood px-6 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-95 disabled:opacity-50"
              >
                {busy ? "Saving…" : "Update password"}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <p className="flex items-start gap-2 pt-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-rosewood" strokeWidth={1.5} />
                Encrypted in transit · screened against breached-password databases.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
