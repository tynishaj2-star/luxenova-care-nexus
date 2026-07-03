import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, X } from "lucide-react";

/** Small dismissible banner shown to signed-in users on the public site. */
export function WelcomeBanner() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("welcome_dismissed") === "1") {
      setDismissed(true);
    }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const raw = (prof?.full_name || user.email || "").trim();
      const first = raw.includes(" ") ? raw.split(/\s+/)[0] : raw.split("@")[0];
      if (first) setFirstName(first.charAt(0).toUpperCase() + first.slice(1));
    })();
  }, []);

  if (!firstName || dismissed) return null;

  return (
    <div className="border-b border-rosewood/20 bg-gradient-rosewood/10 text-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-2.5 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-rosewood" strokeWidth={1.5} />
          <span>
            Welcome back, <strong>{firstName}</strong>! —{" "}
            <Link to="/board-portal" className="text-rosewood underline underline-offset-2">Go to your board portal →</Link>
          </span>
        </div>
        <button
          onClick={() => { sessionStorage.setItem("welcome_dismissed", "1"); setDismissed(true); }}
          aria-label="Dismiss welcome"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
