// Single source of truth for staff "job roles" inside the back office.
// All five accounts share the DB `staff` role; this maps each person to the
// workspace they should land on by email.

export type JobRole = "admin" | "coo" | "cfo" | "events" | "clerk";

export type StaffMember = {
  email: string;
  name: string;
  title: string;
  jobRole: JobRole;
};

export const STAFF_DIRECTORY: StaffMember[] = [
  {
    email: "tjohnson@luxenovacommunitywellness.com",
    name: "Tynisha Johnson",
    title: "Founder · President · Executive Director",
    jobRole: "admin",
  },
  {
    email: "teverett@luxenovacommunitywellness.com",
    name: "Trina Everett",
    title: "Co-Founder · Director / COO · Community Impact & Program Oversight",
    jobRole: "coo",
  },
  {
    email: "deverett@luxenovacommunitywellness.com",
    name: "Darien Everett",
    title: "Treasurer / CFO",
    jobRole: "cfo",
  },
  {
    email: "jyounge@luxenovacommunitywellness.com",
    name: "Joe Younge",
    title: "Events & Finance Support",
    jobRole: "events",
  },
  {
    email: "jdyer@luxenovacommunitywellness.com",
    name: "Jerez Dyer",
    title: "Clerk / Secretary",
    jobRole: "clerk",
  },
];

export function getStaffByEmail(email?: string | null): StaffMember | null {
  if (!email) return null;
  const lower = email.trim().toLowerCase();
  return STAFF_DIRECTORY.find((s) => s.email.toLowerCase() === lower) ?? null;
}

export function getJobRole(email?: string | null): JobRole {
  return getStaffByEmail(email)?.jobRole ?? "admin";
}

export const JOB_ROLE_LABEL: Record<JobRole, string> = {
  admin: "Executive Director (Admin)",
  coo: "Director / COO",
  cfo: "Treasurer / CFO",
  events: "Events & Finance",
  clerk: "Clerk / Secretary",
};
