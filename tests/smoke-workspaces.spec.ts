/**
 * Workspace smoke tests — signs in as each staff identity and verifies the
 * workspace loads its expected heading and key controls without permission
 * errors in the console.
 *
 * Run locally (do NOT commit credentials):
 *
 *   BASE_URL=https://luxenovacommunitywellnessinc.com \
 *   ADMIN_EMAIL=tjohnson@luxenovacommunitywellness.com  ADMIN_PASSWORD=... \
 *   COO_EMAIL=teverett@luxenovacommunitywellness.com    COO_PASSWORD=... \
 *   CFO_EMAIL=deverett@luxenovacommunitywellness.com    CFO_PASSWORD=... \
 *   EVENTS_EMAIL=jyounge@luxenovacommunitywellness.com  EVENTS_PASSWORD=... \
 *   CLERK_EMAIL=jdyer@luxenovacommunitywellness.com     CLERK_PASSWORD=... \
 *   npx playwright test tests/smoke-workspaces.spec.ts
 *
 * Each identity logs in, lands on /portal, then we assert the workspace
 * heading text is present and that no console message contains 'permission',
 * 'denied', '401', or '403'.
 */

import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";

type Identity = {
  role: string;
  email?: string;
  password?: string;
  /** Substring expected in the workspace once logged in. */
  expectHeading: RegExp;
  /** Buttons / labels that must be present in their workspace. */
  expectControls: (string | RegExp)[];
};

const IDENTITIES: Identity[] = [
  {
    role: "Admin (Executive Director)",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    expectHeading: /Executive Director|Admin Intake Dashboard|Operations Center/i,
    expectControls: [/Quick Actions/i, /Audit Log/i, /Permission matrix/i],
  },
  {
    role: "COO",
    email: process.env.COO_EMAIL,
    password: process.env.COO_PASSWORD,
    expectHeading: /Program (Oversight|Impact)/i,
    expectControls: [/Program/i, /Oversight/i],
  },
  {
    role: "CFO",
    email: process.env.CFO_EMAIL,
    password: process.env.CFO_PASSWORD,
    expectHeading: /Treasury/i,
    expectControls: [/Donations/i, /Compliance|Filings|Checklist/i],
  },
  {
    role: "Events & Finance",
    email: process.env.EVENTS_EMAIL,
    password: process.env.EVENTS_PASSWORD,
    expectHeading: /Events|Drives/i,
    expectControls: [/Runbook|Drives|Hand-off/i],
  },
  {
    role: "Clerk / Secretary",
    email: process.env.CLERK_EMAIL,
    password: process.env.CLERK_PASSWORD,
    expectHeading: /Records|Clerk/i,
    expectControls: [/Bylaws/i, /Governance|Board/i],
  },
];

async function signIn(page: Page, email: string, password: string) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/password/i).first().fill(password);
  const submit = page
    .getByRole("button", { name: /sign in|log in|continue/i })
    .first();
  await submit.click();
  await page.waitForURL(/\/portal/, { timeout: 15_000 });
}

for (const id of IDENTITIES) {
  test(`workspace loads cleanly for ${id.role}`, async ({ page }) => {
    test.skip(!id.email || !id.password, `Missing creds for ${id.role}`);

    const errors: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text().toLowerCase();
      if (
        text.includes("permission denied") ||
        text.includes(" 401") ||
        text.includes(" 403") ||
        text.includes("rls")
      ) {
        errors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

    await signIn(page, id.email!, id.password!);

    // Workspace must render its heading
    await expect(page.getByText(id.expectHeading).first()).toBeVisible({
      timeout: 15_000,
    });

    // Required controls must be present
    for (const control of id.expectControls) {
      await expect(page.getByText(control).first()).toBeVisible();
    }

    expect(errors, `permission/rls errors for ${id.role}:\n${errors.join("\n")}`).toEqual([]);
  });
}
