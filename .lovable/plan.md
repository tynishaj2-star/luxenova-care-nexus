# Welcome + Remaining Back Offices

## 1. First-name welcome

**Portal dashboard** (`/board-portal`): already renders `Welcome back, {firstName}!` from `member.name.split(" ")[0]`. Verify at runtime; no change expected.

**Public homepage** (`/`): add a dismissible banner that appears only when the visitor is signed in and has a `profiles.full_name`. Copy: `Welcome back, {firstName}! — Go to your board portal →`. Uses `supabase.auth.getUser()` + a lightweight `profiles` query. First name = first whitespace token of `full_name`, falling back to email local-part.

## 2. Back offices to build

Each role gets a layout guard route + hub + workspace pages, styled like the existing ED/CFO back offices (`WorkspacePage`, tiles, activity feed on hub). All writes go through Supabase with RLS; all mutations produce `activity_feed` entries via existing `log_activity` trigger where the underlying table already has it, and via new triggers where it doesn't.

### Secretary (Jerez) — `/board-portal/secretary/*`
Job-role guard: `admin` OR `staff` with `job_role = 'secretary'`.

- Hub — tiles + activity feed
- Board Minutes — CRUD (new table `board_minutes`: meeting_date, title, body, status draft|approved, approved_at)
- Meeting Records — CRUD (new table `meeting_records`: meeting_date, kind, attendees jsonb, quorum bool, notes)
- Policies — CRUD (new table `policies`: title, category, body, effective_at, version)
- Filing Tracker — CRUD (new table `filings`: name, jurisdiction, due_at, status, notes, filed_at)
- Board Votes — CRUD (new table `board_votes`: motion, meeting_date, tally jsonb, outcome)
- Documents (reuse `documents` table, filtered to governance category)

### Programs Director (Trina) — `/board-portal/programs/*`
Guard: `admin` OR `staff` with `job_role = 'programs'` (or the existing Director role check).

- Hub — tiles + activity feed
- Programs — CRUD on existing `programs` table
- Program Outcomes — CRUD on existing `program_outcomes`
- Family Stabilization — read-only view over `referrals` grouped by household, with note-adding via existing `referral_notes`
- Partner Feedback — new table `partner_feedback`: partner_name, kind, body, submitted_at
- Resource Gaps — new table `resource_gaps`: title, description, priority, status

### Assistant Secretary (Mary) — `/board-portal/asst-secretary/*`
Guard: `admin` OR `staff` with `job_role = 'assistant_secretary'`. Read/edit access to Secretary tables scoped down (no delete):

- Hub
- Draft Minutes (create + edit own drafts on `board_minutes` where status='draft')
- Meeting Records (create + edit)
- Filing Tracker (mark reminders / notes; no delete)
- Document Archive (upload to existing `documents` bucket, categorize)

### Events / Asst Treasurer (Joe) — `/board-portal/events/*`
Guard: `admin` OR `staff` with `job_role IN ('events','assistant_treasurer')`.

- Hub — upcoming events + activity feed
- Events — CRUD on `calendar_events` (kind='event')
- Event Budgets — new table `event_budgets`: event_id fk, category, planned_cents, spent_cents view
- Event Expenses — reuse `expenses` with new `event_id` nullable fk + receipt upload (already built for CFO)
- Purchase Requests — new table `purchase_requests`: event_id, item, amount_cents, vendor, status pending|approved|denied, requested_by, decided_by
- Reimbursements — new table `reimbursements`: user_id, amount_cents, description, receipt_path, status
- Vendors — new table `vendors`: name, category, contact, phone, email, notes
- Volunteer Assignments — CRUD on existing `volunteer_assignments`
- Inventory — new table `inventory_items`: name, category, quantity, location, notes
- Shopping Lists — new table `shopping_lists` + `shopping_list_items`
- Event Documents — reuse `documents` filtered to category='event'

## 3. Data & security

Single migration that:

- Adds `profiles.job_role text` (nullable) if not already present — used by all job-role guards.
- Creates new tables above with `created_at`, `updated_at`, `created_by uuid default auth.uid()`.
- GRANTs `SELECT,INSERT,UPDATE,DELETE` to `authenticated`, `ALL` to `service_role`.
- Enables RLS on each new table. Policies:
  - SELECT: any signed-in board member (`has_role('board') OR has_role('staff') OR has_role('admin')`).
  - INSERT/UPDATE/DELETE: role-scoped via `has_role('admin')` OR `has_role('staff')` with matching `job_role` on `profiles`.
- Adds `log_activity` `AFTER INSERT/UPDATE/DELETE` trigger on every new table.
- Adds `set_updated_at` `BEFORE UPDATE` trigger on every new table.
- Adds `event_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL` to `expenses` (nullable — CFO flow unchanged).
- Storage: reuse `expense-receipts` bucket for reimbursement receipts; add policy already permits staff.

## 4. Wiring

- Route files created for every workspace above under `src/routes/board-portal.<role>.*.tsx`.
- Dashboard quick-links on `/board-portal` grow role-aware: show only the back-office link matching the signed-in member (ED for Tynisha, CFO for Darien, Secretary for Jerez, Programs for Trina, Events for Joe, Asst Secretary for Mary).
- Each workspace's `WorkspacePage` uses the same header/back-link pattern used by CFO.

## Deliverables

1. One migration containing all new tables, grants, RLS, triggers, and the `expenses.event_id` column.
2. New route files per section above (~25 files).
3. Updated `board-portal.tsx` for role-aware quick links.
4. New homepage welcome banner component + integration.

## Notes / limits

- I will NOT auto-seed `profiles.job_role` values for existing board members — you'll be able to set them from the ED → User Management workspace (already built). Until you assign a `job_role`, non-ED/non-Treasurer back offices will be admin-only. Tell me if you want me to seed defaults now (Jerez=secretary, Trina=programs, Mary=assistant_secretary, Joe=events) and I'll add an `insert` step.
- Design Studio / Photo Booth / Decoration Ideas from Joe's list will render as free-form notes tables initially, not visual editors.
