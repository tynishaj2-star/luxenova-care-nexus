
-- =============== helper: updated_at trigger (idempotent) ===============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =============== GRANTS ===============
CREATE TABLE public.grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funder text NOT NULL,
  program text,
  amount_requested numeric(12,2),
  amount_awarded numeric(12,2),
  status text NOT NULL DEFAULT 'prospect',
  deadline date,
  report_due_at date,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grants TO authenticated;
GRANT ALL ON public.grants TO service_role;
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage grants" ON public.grants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view grants" ON public.grants FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Board view grants" ON public.grants FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'board'));
CREATE TRIGGER trg_grants_updated BEFORE UPDATE ON public.grants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============== EXPENSES ===============
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  vendor text,
  amount numeric(12,2) NOT NULL,
  paid_at date,
  method text,
  receipt_path text,
  program_id uuid,
  notes text,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage expenses" ON public.expenses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view expenses" ON public.expenses FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE TRIGGER trg_expenses_updated BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============== VOLUNTEERS ===============
CREATE TABLE public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text,
  skills text,
  background_check_status text DEFAULT 'pending',
  background_checked_at date,
  hours_ytd numeric(8,2) NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO authenticated;
GRANT ALL ON public.volunteers TO service_role;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage volunteers" ON public.volunteers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view volunteers" ON public.volunteers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE TRIGGER trg_volunteers_updated BEFORE UPDATE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============== VOLUNTEER ASSIGNMENTS ===============
CREATE TABLE public.volunteer_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
  program_id uuid,
  event_id uuid,
  role text,
  hours numeric(6,2) DEFAULT 0,
  assignment_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteer_assignments TO authenticated;
GRANT ALL ON public.volunteer_assignments TO service_role;
ALTER TABLE public.volunteer_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage vol assignments" ON public.volunteer_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view vol assignments" ON public.volunteer_assignments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE TRIGGER trg_vol_assign_updated BEFORE UPDATE ON public.volunteer_assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============== STAFF ===============
CREATE TABLE public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  title text,
  email text,
  phone text,
  employment_status text DEFAULT 'active',
  start_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO authenticated;
GRANT ALL ON public.staff TO service_role;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage staff" ON public.staff FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view staff" ON public.staff FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE TRIGGER trg_staff_updated BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============== PROGRAMS ===============
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active',
  start_at date,
  end_at date,
  budget numeric(12,2),
  participant_count integer DEFAULT 0,
  outcomes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage programs" ON public.programs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view programs" ON public.programs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Board view programs" ON public.programs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'board'));
CREATE TRIGGER trg_programs_updated BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============== PROGRAM OUTCOMES ===============
CREATE TABLE public.program_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  metric text NOT NULL,
  value numeric(12,2),
  period text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_outcomes TO authenticated;
GRANT ALL ON public.program_outcomes TO service_role;
ALTER TABLE public.program_outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage program outcomes" ON public.program_outcomes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view program outcomes" ON public.program_outcomes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Board view program outcomes" ON public.program_outcomes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'board'));
CREATE TRIGGER trg_program_outcomes_updated BEFORE UPDATE ON public.program_outcomes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============== ORG SETTINGS ===============
CREATE TABLE public.org_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  org_name text NOT NULL DEFAULT 'LuxeNova Community Wellness, Inc.',
  ein text,
  address text,
  phone text,
  email text,
  brand_color text,
  logo_path text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_settings TO authenticated;
GRANT ALL ON public.org_settings TO service_role;
ALTER TABLE public.org_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Any authed view org settings" ON public.org_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage org settings" ON public.org_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_org_settings_updated BEFORE UPDATE ON public.org_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.org_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =============== ACTIVITY FEED ===============
CREATE TABLE public.activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id text,
  action text NOT NULL,
  summary text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_feed TO authenticated;
GRANT ALL ON public.activity_feed TO service_role;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view activity" ON public.activity_feed FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view activity" ON public.activity_feed FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'staff'));
CREATE INDEX idx_activity_feed_created ON public.activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_entity ON public.activity_feed(entity_type, created_at DESC);

-- =============== TASKS: attachments + progress ===============
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS progress smallint NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_attachments TO authenticated;
GRANT ALL ON public.task_attachments TO service_role;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authed view task attachments" ON public.task_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authed insert task attachments" ON public.task_attachments FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "Uploader delete task attachments" ON public.task_attachments FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- =============== ACTIVITY FEED TRIGGERS ===============
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_summary text;
  v_entity text := TG_ARGV[0];
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_summary := v_entity || ' created';
  ELSIF TG_OP = 'UPDATE' THEN
    v_summary := v_entity || ' updated';
  ELSIF TG_OP = 'DELETE' THEN
    v_summary := v_entity || ' deleted';
  END IF;
  INSERT INTO public.activity_feed (actor_id, entity_type, entity_id, action, summary, metadata)
  VALUES (
    auth.uid(),
    v_entity,
    COALESCE((CASE WHEN TG_OP='DELETE' THEN OLD.id ELSE NEW.id END)::text, ''),
    lower(TG_OP),
    v_summary,
    '{}'::jsonb
  );
  RETURN COALESCE(NEW, OLD);
END; $$;

CREATE TRIGGER trg_activity_grants AFTER INSERT OR UPDATE OR DELETE ON public.grants
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('grant');
CREATE TRIGGER trg_activity_expenses AFTER INSERT OR UPDATE OR DELETE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('expense');
CREATE TRIGGER trg_activity_volunteers AFTER INSERT OR UPDATE OR DELETE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('volunteer');
CREATE TRIGGER trg_activity_staff AFTER INSERT OR UPDATE OR DELETE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('staff');
CREATE TRIGGER trg_activity_programs AFTER INSERT OR UPDATE OR DELETE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('program');
CREATE TRIGGER trg_activity_announcements AFTER INSERT OR UPDATE OR DELETE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('announcement');
CREATE TRIGGER trg_activity_donations AFTER INSERT OR UPDATE OR DELETE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('donation');
CREATE TRIGGER trg_activity_documents AFTER INSERT OR UPDATE OR DELETE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.log_activity('document');

REVOKE EXECUTE ON FUNCTION public.log_activity() FROM PUBLIC, authenticated, anon;

-- =============== SEED: ensure Tynisha is admin ===============
DO $$
DECLARE v_user uuid;
BEGIN
  SELECT user_id INTO v_user FROM public.board_members WHERE member_key = 'tynisha' LIMIT 1;
  IF v_user IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
