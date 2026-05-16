import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-espresso p-10 text-ivory shadow-luxe md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-rosewood/30 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ivory/70">Stay Connected</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-balance">
                Updates from LuxeNova, delivered with care.
              </h2>
              <p className="mt-4 text-sm text-ivory/75">
                Resources, announcements, and partner opportunities — never
                spam, always respectful of your inbox.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setDone(true);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              {done ? (
                <div className="flex w-full items-center gap-3 rounded-2xl border border-ivory/20 bg-ivory/[0.05] px-5 py-4 text-sm text-ivory">
                  <Mail className="h-4 w-4" /> Thank you — you're on the list.
                </div>
              ) : (
                <>
                  <label className="sr-only" htmlFor="news-email">Email Address</label>
                  <input
                    id="news-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="h-12 flex-1 rounded-full border border-ivory/20 bg-ivory/[0.06] px-5 text-sm text-ivory placeholder:text-ivory/50 outline-none transition focus:border-ivory/50"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-ivory px-6 py-3 text-sm font-medium text-espresso transition hover:bg-ivory/90"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
