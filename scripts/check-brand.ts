/**
 * Brand audit: confirms "LuxeNova Community Wellness, Inc." appears on every
 * page where it is legally or visually required (main site, referral portal,
 * admin / partner dashboards, legal pages).
 *
 * Run with:  bun run scripts/check-brand.ts
 * Exits 1 if any required surface is missing the legal name.
 */
import { ORG } from "../src/lib/org";

const BASE = process.env.BRAND_CHECK_BASE_URL ?? "http://localhost:8080";

// Routes that MUST contain the full legal name somewhere in rendered HTML.
const REQUIRED_ROUTES = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/referrals",
  "/portal",          // login / partner / admin entry
  "/login",
  "/privacy",
  "/terms",
  "/hipaa",
  "/bylaws",
  "/conflict-of-interest",
  "/governance",
  "/nonprofit-status",
  "/staffing-compensation",
  "/transparency",
  "/board",
];

type Result = { route: string; ok: boolean; status: number; note?: string };

async function check(route: string): Promise<Result> {
  const url = `${BASE}${route}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const ok = html.includes(ORG.legalName);
    return {
      route,
      status: res.status,
      ok,
      note: ok ? undefined : `missing "${ORG.legalName}"`,
    };
  } catch (err) {
    return { route, status: 0, ok: false, note: (err as Error).message };
  }
}

async function main() {
  console.log(`Brand audit — expecting "${ORG.legalName}" on ${REQUIRED_ROUTES.length} routes`);
  console.log(`Base: ${BASE}\n`);

  const results = await Promise.all(REQUIRED_ROUTES.map(check));
  let failed = 0;
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    const detail = r.ok ? "" : `  — ${r.note}`;
    console.log(`${mark} [${r.status}] ${r.route}${detail}`);
    if (!r.ok) failed++;
  }
  console.log(`\n${results.length - failed}/${results.length} passed`);
  if (failed > 0) process.exit(1);
}

main();
