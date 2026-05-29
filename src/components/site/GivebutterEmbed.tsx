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
    </div>
  );
}

