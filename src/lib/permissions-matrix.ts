// Permission matrix + per-workspace readiness definitions.
// Used by the admin "Permissions & Readiness" section to render a live view
// of what each role can do, and a checklist of every tool each workspace needs.

import type { JobRole } from "./staff-roles";

export type Action = {
  id: string;
  label: string;
  category: "Requests" | "Donations" | "Alerts" | "Audit" | "Governance" | "People" | "Communications";
  // Allowed job roles
  allowedFor: JobRole[];
  // Live probe: a SQL-ish description of the gate (for display only)
  gate: string;
  // Optional live probe key — used to actually run a SELECT against the DB to
  // verify the current user has read access. (Write-probes are intentionally
  // not run to avoid creating junk rows.)
  readProbeTable?:
    | "audit_logs"
    | "donations"
    | "emergency_alerts"
    | "announcements"
    | "referrals"
    | "role_requests"
    | "board_members"
    | "user_roles";
};

export const PERMISSION_MATRIX: Action[] = [
  // ---- Requests ----
  { id: "req.view", label: "View referrals", category: "Requests", allowedFor: ["admin", "coo", "cfo", "events", "clerk"], gate: "RLS: admin OR staff", readProbeTable: "referrals" },
  { id: "req.update_status", label: "Change referral status", category: "Requests", allowedFor: ["admin", "coo"], gate: "Server fn: admin/staff (audited)" },
  { id: "req.add_note", label: "Add internal note", category: "Requests", allowedFor: ["admin", "coo", "events", "clerk"], gate: "Server fn: admin/staff" },
  { id: "req.export", label: "Export referrals", category: "Requests", allowedFor: ["admin"], gate: "Admin-only (CSV/PDF)" },

  // ---- Donations ----
  { id: "don.view", label: "View donations", category: "Donations", allowedFor: ["admin", "cfo", "events"], gate: "RLS: admin OR staff", readProbeTable: "donations" },
  { id: "don.add", label: "Log new donation", category: "Donations", allowedFor: ["admin", "cfo", "events"], gate: "RLS INSERT: admin/staff" },
  { id: "don.edit", label: "Edit / delete donation", category: "Donations", allowedFor: ["admin"], gate: "RLS UPDATE/DELETE: admin only" },

  // ---- Alerts ----
  { id: "alert.view", label: "View emergency alerts", category: "Alerts", allowedFor: ["admin", "coo", "cfo", "events", "clerk"], gate: "RLS: admin OR staff", readProbeTable: "emergency_alerts" },
  { id: "alert.raise", label: "Raise / resolve alert", category: "Alerts", allowedFor: ["admin", "coo"], gate: "RLS INSERT/UPDATE: admin/staff" },
  { id: "alert.delete", label: "Delete alert", category: "Alerts", allowedFor: ["admin"], gate: "RLS DELETE: admin only" },

  // ---- Audit ----
  { id: "audit.view", label: "View audit log", category: "Audit", allowedFor: ["admin", "coo", "clerk"], gate: "RLS: admin OR staff", readProbeTable: "audit_logs" },
  { id: "audit.export", label: "Export audit log (CSV/PDF)", category: "Audit", allowedFor: ["admin", "clerk"], gate: "Client export of readable rows" },

  // ---- Governance ----
  { id: "gov.view", label: "View bylaws / COI / governance", category: "Governance", allowedFor: ["admin", "coo", "cfo", "events", "clerk"], gate: "Public/internal pages" },
  { id: "gov.board_meetings", label: "Manage board meetings", category: "Governance", allowedFor: ["admin", "clerk"], gate: "Board Portal" },
  { id: "gov.announce", label: "Post announcements", category: "Communications", allowedFor: ["admin", "coo", "clerk"], gate: "RLS INSERT: admin/staff", readProbeTable: "announcements" },

  // ---- People ----
  { id: "ppl.invite", label: "Invite new partner / staff", category: "People", allowedFor: ["admin"], gate: "Server fn: admin only (has_role)" },
  { id: "ppl.role_approve", label: "Approve role requests", category: "People", allowedFor: ["admin"], gate: "Server fn + RLS: admin", readProbeTable: "role_requests" },
  { id: "ppl.view_roles", label: "View user_roles", category: "People", allowedFor: ["admin"], gate: "RLS: admin only", readProbeTable: "user_roles" },
];

export type ChecklistItem = {
  id: string;
  label: string;
  // Used for live verification
  kind: "route" | "table_read" | "static";
  // For "route": path to verify exists in client routeTree
  route?: string;
  // For "table_read": Supabase table the user must be able to SELECT from
  table?: string;
  // Hint of what to look for if the check is manual
  hint?: string;
};

export type RoleReadiness = {
  role: JobRole;
  homePath: string;
  items: ChecklistItem[];
};

export const READINESS: RoleReadiness[] = [
  {
    role: "admin",
    homePath: "/portal",
    items: [
      { id: "a1", label: "Executive Director dashboard loads", kind: "static", hint: "ExecutiveDirectorSection mounts" },
      { id: "a2", label: "Operations Center available", kind: "static", hint: "OperationsSection nav entry" },
      { id: "a3", label: "Can read audit logs", kind: "table_read", table: "audit_logs" },
      { id: "a4", label: "Can read donations", kind: "table_read", table: "donations" },
      { id: "a5", label: "Can read emergency alerts", kind: "table_read", table: "emergency_alerts" },
      { id: "a6", label: "Can read role requests", kind: "table_read", table: "role_requests" },
      { id: "a7", label: "Can read user_roles", kind: "table_read", table: "user_roles" },
      { id: "a8", label: "Invite User form available", kind: "static", hint: "AdminDashboard → Settings → Invite User" },
      { id: "a9", label: "Board Portal reachable", kind: "route", route: "/board-portal" },
      { id: "a10", label: "Governance / Bylaws reachable", kind: "route", route: "/bylaws" },
    ],
  },
  {
    role: "coo",
    homePath: "/portal (Director/COO workspace)",
    items: [
      { id: "c1", label: "Program oversight dashboard loads", kind: "static", hint: "CooWorkspace mounts" },
      { id: "c2", label: "Can read referrals", kind: "table_read", table: "referrals" },
      { id: "c3", label: "Can read emergency alerts", kind: "table_read", table: "emergency_alerts" },
      { id: "c4", label: "Can read audit log", kind: "table_read", table: "audit_logs" },
      { id: "c5", label: "Community Drives page", kind: "route", route: "/food-drives" },
      { id: "c6", label: "Volunteer policy", kind: "route", route: "/volunteer-policy" },
      { id: "c7", label: "Impact page reachable", kind: "route", route: "/impact" },
      { id: "c8", label: "Chauntae's Voice program page", kind: "route", route: "/chauntaes-voice" },
    ],
  },
  {
    role: "cfo",
    homePath: "/portal (Treasury workspace)",
    items: [
      { id: "f1", label: "Treasury dashboard loads", kind: "static", hint: "CfoWorkspace mounts" },
      { id: "f2", label: "Can read donations", kind: "table_read", table: "donations" },
      { id: "f3", label: "Nonprofit status page", kind: "route", route: "/nonprofit-status" },
      { id: "f4", label: "How Funds Are Used", kind: "route", route: "/how-funds-are-used" },
      { id: "f5", label: "Donation policy", kind: "route", route: "/donation-policy" },
      { id: "f6", label: "Transparency page", kind: "route", route: "/transparency" },
      { id: "f7", label: "Staffing & Compensation policy", kind: "route", route: "/staffing-compensation" },
    ],
  },
  {
    role: "events",
    homePath: "/portal (Events workspace)",
    items: [
      { id: "e1", label: "Events dashboard loads", kind: "static", hint: "EventsWorkspace mounts" },
      { id: "e2", label: "Community Drives form reachable", kind: "route", route: "/food-drives" },
      { id: "e3", label: "Sponsor a Family form", kind: "route", route: "/sponsor-a-family" },
      { id: "e4", label: "Volunteer / Get Involved", kind: "route", route: "/careers" },
      { id: "e5", label: "Can read donations (hand-off)", kind: "table_read", table: "donations" },
      { id: "e6", label: "Updates / news page", kind: "route", route: "/updates" },
    ],
  },
  {
    role: "clerk",
    homePath: "/portal (Clerk workspace)",
    items: [
      { id: "k1", label: "Clerk records dashboard loads", kind: "static", hint: "ClerkWorkspace mounts" },
      { id: "k2", label: "Bylaws page", kind: "route", route: "/bylaws" },
      { id: "k3", label: "Conflict of Interest policy", kind: "route", route: "/conflict-of-interest" },
      { id: "k4", label: "Governance hub", kind: "route", route: "/governance" },
      { id: "k5", label: "Board roster page", kind: "route", route: "/board" },
      { id: "k6", label: "Document hub", kind: "route", route: "/documents" },
      { id: "k7", label: "Can read audit log", kind: "table_read", table: "audit_logs" },
      { id: "k8", label: "Can read announcements", kind: "table_read", table: "announcements" },
    ],
  },
];
