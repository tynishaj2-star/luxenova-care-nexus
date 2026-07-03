
# Executive Director Workspace — Full Build

Turn Tynisha's dashboard from static cards into a working back office. Every section opens a real workspace with action buttons, uploads, exports, and an activity feed. Scoped to ED-level permissions (view/manage everything).

## Scope (this pass — ED only)

Twelve workspaces under `/board-portal/ed/*`, each a real page with CRUD, filters, and role-gated actions:

1. **Board Management** — add/remove board members, edit roles, assign portal access
2. **User Management** — list all users, assign/revoke roles (`admin`, `staff`, `board`, `partner`), reset access
3. **Grant Management** — grants CRUD (funder, amount, status, deadlines, docs, report due)
4. **Donations** — record donation, list, filter, export CSV, acknowledgment status
5. **Financial Reports** — period reports from donations + expenses, export PDF/CSV, print
6. **Volunteer Management** — volunteer records, hours, assignments, background-check tracking
7. **Staff Management** — staff list, role/title, contact, onboarding status
8. **Website Management** — announcements & site updates CRUD, publish/unpublish
9. **Program Management** — programs CRUD, outcomes, participant counts
10. **Reports Hub** — links + generators for org-wide reports (finance, program, impact, audit)
11. **Organization Documents** — bylaws, articles, EIN, filings — upload/download/archive/version
12. **Audit Logs** — read-only stream of `audit_logs` with filter/search/export
13. **Settings** — org profile, contact, branding, portal preferences

Plus a shared **Task Center** and **Activity Feed** available to ED (and reused later by other roles).

## Data model (new tables, all with RLS + GRANTs + `updated_at` triggers)

- `grants` — funder, program, amount_requested, amount_awarded, status, deadline, report_due_at, notes, attachments
- `expenses` — category, vendor, amount, paid_at, method, receipt_path, program_id, notes, approved_by
- `volunteers` — full_name, email, phone, skills, background_check_status, checked_at, hours_ytd, active
- `volunteer_assignments` — volunteer_id, event_id/program_id, role, hours, date
- `staff` — user_id (nullable for pre-hire), full_name, title, email, phone, employment_status, start_date
- `programs` — name, description, status, start_at, end_at, budget, participant_count, outcomes
- `program_outcomes` — program_id, metric, value, period, notes
- `org_settings` — singleton row: org name, ein, address, phone, email, brand color, logo_path
- `activity_feed` — actor_id, entity_type, entity_id, action, summary, metadata (materialized via triggers on the tables above + existing tasks/announcements/documents)

Existing tables reused: `board_members`, `user_roles`, `profiles`, `donations`, `documents`, `announcements`, `tasks`, `audit_logs`, `notifications`.

## RLS policy shape

- Every new table: `SELECT/INSERT/UPDATE/DELETE` for authenticated + `has_role(auth.uid(),'admin')` for full access; scoped read for `staff`/`board` where appropriate; no `anon` grants.
- ED (Tynisha) gets the `admin` role in `user_roles` (migration seeds if missing).
- Activity feed: insert via `SECURITY DEFINER` triggers; select gated to `admin`/`staff`.

## Shared UI kit for workspaces

New `src/components/portal/workspace/` primitives, reused across every ED page (and future roles):

- `WorkspacePage` — header with title, back link, action bar
- `ActionBar` — New / Edit / Save / Upload / Download / Archive / Delete / Export PDF / Export CSV / Print / Search / Filter (permission-aware, hides buttons the current role can't use)
- `DataTable` — sortable, searchable, filterable list with row actions
- `RecordDrawer` — side panel for create/edit forms (zod-validated)
- `FileDropzone` — reused upload UI wired to `board-documents` bucket, saves under owner folder
- `ActivityStream` — reusable list bound to `activity_feed` (filter by entity type)
- `TaskCenter` — reusable component: assigned tasks, due dates, priority, notes, attachments, progress; wired to existing `tasks` table plus new `task_attachments` and `progress` column

## Dashboard changes (`/board-portal`)

- Fix welcome name — already `firstName`, confirm rendering; add fallback to `profiles.full_name` if `board_members.name` missing.
- ED-only rail: replace ED's read-only section cards with clickable tiles linking to the 13 workspaces above.
- Snapshot cards become clickable (Tasks → Task Center, Notifications → Notifications page, Announcements → Website Management).
- Add "Recent Activity" card on ED dashboard reading from `activity_feed`.

## Server functions (new, all under `src/lib/*.functions.ts`)

- `grants.functions.ts`, `expenses.functions.ts`, `volunteers.functions.ts`, `staff.functions.ts`, `programs.functions.ts`, `org-settings.functions.ts`, `reports.functions.ts` (CSV/PDF generation), `user-admin.functions.ts` (list users, assign roles — verified admin only, loads `supabaseAdmin` inside handler).
- All use `requireSupabaseAuth` middleware + `has_role(userId,'admin')` gate.

## Exports

- CSV: generated in-browser via a small util (`src/lib/export-csv.ts`).
- PDF: server function using `pdf-lib` (edge-compatible), streams response.
- Print: `window.print()` with print-only stylesheet on report pages.

## Out of scope (this pass)

- Treasurer, Events (Joe), Clerk, Assistant Clerk, Director workspaces — will be built role-by-role in follow-up passes, reusing the same primitives and tables.
- Real-time collaboration inside forms.
- Email digest of activity feed.

## Files to add (high level)

```text
supabase/migrations/<ts>_ed_workspace_schema.sql
supabase/migrations/<ts>_activity_feed_triggers.sql
src/components/portal/workspace/{WorkspacePage,ActionBar,DataTable,RecordDrawer,FileDropzone,ActivityStream,TaskCenter}.tsx
src/lib/{grants,expenses,volunteers,staff,programs,org-settings,reports,user-admin}.functions.ts
src/lib/export-csv.ts
src/routes/board-portal.ed.tsx                    (ED hub layout)
src/routes/board-portal.ed.index.tsx              (tile grid)
src/routes/board-portal.ed.board.tsx
src/routes/board-portal.ed.users.tsx
src/routes/board-portal.ed.grants.tsx
src/routes/board-portal.ed.donations.tsx
src/routes/board-portal.ed.financial-reports.tsx
src/routes/board-portal.ed.volunteers.tsx
src/routes/board-portal.ed.staff.tsx
src/routes/board-portal.ed.website.tsx
src/routes/board-portal.ed.programs.tsx
src/routes/board-portal.ed.reports.tsx
src/routes/board-portal.ed.documents.tsx
src/routes/board-portal.ed.audit.tsx
src/routes/board-portal.ed.settings.tsx
src/routes/board-portal.tasks.tsx                 (upgrade to full Task Center)
```

## Order of execution

1. Migrations (schema + RLS + grants + triggers) — one call, awaits approval.
2. Shared workspace primitives + Task Center upgrade.
3. Server functions for all ED entities.
4. Route files (13 workspaces) in parallel batches.
5. Dashboard ED tile rail + Recent Activity card.
6. Smoke-test with Playwright signed in as Tynisha; verify permissions block non-admin.

## Confirm before I start

This will be ~25 new files, one large migration awaiting your approval, and roughly 3-4 build cycles. Reply "go" and I'll start with the migration.
