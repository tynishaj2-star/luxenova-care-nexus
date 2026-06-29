// Single source of truth for organization branding.
// Update values here and they propagate to the navbar, footer, legal pages, and emails.
export const ORG = {
  legalName: "LuxeNova Community Wellness, Inc.",
  shortName: "LuxeNova",
  email: "tjohnson@luxenovacommunitywellness.com",
  domain: "luxenovacommunitywellnessinc.com",
  url: "https://luxenovacommunitywellnessinc.com",
  copyrightYear: new Date().getFullYear(),
} as const;

export const ORG_LEGAL_NAME = ORG.legalName;
