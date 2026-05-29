import { createElement, useEffect } from "react";

const SCRIPT_SRC = "https://widgets.givebutter.com/latest.umd.cjs?acct=Q19LbjjEPHbW5HwI&p=other";

interface GivebutterEmbedProps {
  campaignId?: string;
  className?: string;
}

/**
 * Embeds the Givebutter donation widget for the
 * LuxeNova Community Relief Fund campaign.
 * Original campaign URL: https://givebutter.com/luxenova-community-relief-fund-s0uagc
 */
export function GivebutterEmbed({
  campaignId = "s0uagc",
  className = "",
}: GivebutterEmbedProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className={className}>
      {createElement("givebutter-widget", { id: campaignId })}
      <div className="mt-6 flex justify-center">
        <a
          href={`https://givebutter.com/luxenova-community-relief-fund-${campaignId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rosewood px-7 py-3 text-sm font-medium text-rosewood-foreground shadow-luxe transition hover:opacity-90"
        >
          Donate on Givebutter
        </a>
      </div>
    </div>
  );
}

