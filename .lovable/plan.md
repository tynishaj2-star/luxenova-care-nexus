## Board Member Portal — Phased Build Plan

Goal: turn `/board-portal` and the staff back office into a full role-based platform for the 6 LuxeNova board/staff accounts (Tynisha, Trina, Darien, Jerez, Mary, Joe), with personalized dashboards, real data, and audit-grade security.

I'll ship this across ~5 turns. After each phase you review the preview, then I move to the next.

---

### Phase 1 — Personalized shell + per-role dashboards (this turn)

**What ships:**
- New `/board-portal` landing that greets the signed-in user by name with:
  - "Welcome back, {First Last} 👋"
  - Role badge (Executive Director / Treasurer / Director / Clerk / Assistant Clerk / Events)
  - Today's date, profile avatar (initials), quick logout, dark-mode toggle
  - 3 cards: Upcoming Tasks, Recent Notifications, Board Announcements (real data if present, empty-state otherwise)
- Rebuilt 5 role dashboards under `/board-portal/*`:
  - `/board-portal/executive` — ED admin overview (all widgets, links to every section)
  - `/board-portal/treasurer` — financial widgets
  - `/board-portal/director` — programs/events/volunteers
  - `/board-portal/clerk` — minutes/bylaws/attendance
  - `/board-portal/assistant-clerk` — drafts/filing queue
- Role-based routing: user is auto-redirected to their dashboard after login; ED sees an "Impersonate" switcher (already exists — reused).
- Shared `<PortalShell>` with search bar, notifications bell, messages icon, avatar menu, sidebar nav filtered by role.
- Quick links, recent activity feed (from `audit_logs`).

**Data now:** tasks/notifications/messages tables ship in Phase 2 — Phase 1 renders empty states with clear "No tasks yet" messaging so the shell is real.

### Phase 2 — Tasks, Notifications, Messages, Calendar, Announcements

New tables (all RLS-protected, GRANTed):
- `tasks` (assignee_id, assigner_id, title, description, due_at, status, priority, role_scope)
- `task_comments`, `task_attachments`
- `notifications` (user_id, kind, title, body, link, read_at)
- `messages` (from_id, to_id, thread_id, body, read_at) + `message_threads`
- `calendar_events` (title, starts_at, ends_at, location, visibility, created_by)
- `announcements_v2` (extend existing `announcements` with audience filter)

UI:
- Task board per user + "Assigned by me" for ED/Director/Clerk
- Notifications bell dropdown + `/board-portal/notifications`
- Internal messaging inbox `/board-portal/messages`
- Shared calendar `/board-portal/calendar` with month/week view
- Announcement composer for ED/Clerk

Triggers auto-create notifications on task assignment, meeting scheduled, document uploaded, announcement posted.

### Phase 3 — Documents Center + Financial Ledger

Documents:
- `documents` table + Supabase Storage bucket `board-documents` (private, signed URLs)
- Upload/tag/version, role-scoped visibility, audit on every download

Financial ledger (Treasurer + ED only):
- `ledger_donations`, `ledger_expenses`, `ledger_grants`, `ledger_bank_statements`, `ledger_reimbursements`, `budgets`
- Treasurer dashboard widgets pull real numbers (bank balance = sum of deposits − expenses, MTD donations, etc.)
- Add/edit forms, receipt upload, monthly report generator (PDF via existing readiness-report util)
- Export CSV per table

### Phase 4 — Meetings, Minutes, Agenda, Voting, Attendance (Clerk stack)

- `meetings`, `meeting_agendas`, `meeting_minutes` (draft/approved), `meeting_attendance`, `resolutions`, `votes`
- Agenda builder, minutes editor (rich text via existing markdown), approval flow (Clerk drafts → ED approves)
- Attendance check-in per meeting, voting record log
- Board Meeting dashboard widget everywhere

### Phase 5 — Security hardening, audit viewer, analytics, exports

- **Session auto-logout** on inactivity (15 min configurable) — client-side idle detector + `supabase.auth.signOut()`
- **Password reset** polish (already has `/reset-password`, add "Forgot password" link on login, rate-limit)
- **Audit log viewer** `/board-portal/audit` (ED only) — filter by user/entity/action, export CSV
- **Website analytics** widget on ED dashboard (uses existing `analytics--read_project_analytics`)
- **Social media analytics** — manual entry table for now (no API keys)
- **Fundraising progress** widget (goal + raised from ledger)
- **Program statistics** widget (households served, meals, hours from Director's program tables)
- 2FA (TOTP) deferred per your answer — I'll add it in a follow-up when you're ready.

---

### Permissions matrix (enforced via RLS + `has_role` + `job_role` on profile)

| Capability                 | ED | Treasurer | Director | Clerk | Asst Clerk | Events |
| -------------------------- | -- | --------- | -------- | ----- | ---------- | ------ |
| Manage users/permissions   | ✅ |           |          |       |            |        |
| Add/edit board members     | ✅ |           |          |       |            |        |
| View all reports           | ✅ | fin only  | prog     | gov   | gov (read) | events |
| Financial ledger write     | ✅ | ✅        |          |       |            |        |
| Approve expenses           | ✅ | ✅        |          |       |            |        |
| Create meetings/minutes    | ✅ |           |          | ✅    | draft only |        |
| Approve minutes/docs       | ✅ |           |          | ✅    |            |        |
| Create programs/events     | ✅ |           | ✅       |       |            | events |
| Assign volunteers          | ✅ |           | ✅       |       |            | ✅     |
| Upload documents           | ✅ | ✅ fin    | ✅ prog  | ✅    | ✅         | ✅ evt |
| View audit logs            | ✅ |           |          |       |            |        |

Enforced at DB level (RLS policies keyed on `has_role` + `staff_directory.job_role`), UI hides what the user can't do.

### Technical notes

- Auth: existing Supabase Auth + `_authenticated/route.tsx` gate. Add per-role sub-guards in each dashboard route's `beforeLoad`.
- Job-role source of truth: extend existing `src/lib/staff-roles.ts` mapping, mirrored into a DB `staff_job_roles` table so RLS can read it. Board members outside staff (none currently) fall through to `board_member` job role.
- All new tables get `created_at`/`updated_at` + `set_updated_at` trigger, audit entries via existing `audit_logs`.
- Storage bucket `board-documents` created private; signed URLs generated in a `createServerFn`.
- Idle logout: React hook `useIdleLogout(15 * 60_000)` mounted in `_authenticated` layout.
- All server work uses `createServerFn` + `requireSupabaseAuth`; no Edge Functions.
- Existing pages (`/board`, `/board-portal`, `/portal`, workspace components) stay working during migration — new dashboards live under `/board-portal/*` sub-routes.

Ready to start Phase 1 on your approval.