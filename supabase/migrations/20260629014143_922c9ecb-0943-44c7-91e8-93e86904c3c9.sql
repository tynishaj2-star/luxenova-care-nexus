
-- ============================================================
-- Audit log + Operations tables for the Admin Dashboard
-- ============================================================

-- 1) AUDIT LOGS ----------------------------------------------------
CREATE TABLE public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id     UUID,                       -- nullable: system events
  actor_email  TEXT,                       -- denormalized for display
  event_type   TEXT NOT NULL,              -- 'user_action' | 'referral_status_change' | 'document_upload' | 'login' | 'invite' | 'other'
  entity_type  TEXT,                       -- 'referral' | 'profile' | 'document' | ...
  entity_id    TEXT,
  action       TEXT NOT NULL,              -- short verb: 'status_changed', 'note_added', 'uploaded', etc.
  summary      TEXT,                       -- human-readable line
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address   TEXT
);

CREATE INDEX idx_audit_logs_occurred_at ON public.audit_logs (occurred_at DESC);
CREATE INDEX idx_audit_logs_event_type  ON public.audit_logs (event_type);
CREATE INDEX idx_audit_logs_actor       ON public.audit_logs (actor_id);

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL            ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin + staff can read all audit logs
CREATE POLICY "Admin/staff read audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'staff')
  );

-- Any authenticated user may insert their own audit entries
CREATE POLICY "Authenticated insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);

-- 2) DONATIONS -----------------------------------------------------
CREATE TABLE public.donations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  donor_name    TEXT NOT NULL,
  donor_email   TEXT,
  amount_cents  INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency      TEXT NOT NULL DEFAULT 'USD',
  source        TEXT NOT NULL DEFAULT 'Manual',   -- 'Givebutter', 'Cash', 'Check', 'Manual', etc.
  designation   TEXT,                              -- 'Chauntae''s Voice', 'General', etc.
  notes         TEXT,
  recorded_by   UUID
);

CREATE INDEX idx_donations_created_at ON public.donations (created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/staff read donations"
  ON public.donations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin/staff insert donations"
  ON public.donations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin update donations"
  ON public.donations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin delete donations"
  ON public.donations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) EMERGENCY ALERTS ---------------------------------------------
CREATE TABLE public.emergency_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID,
  severity    TEXT NOT NULL DEFAULT 'info',   -- 'info' | 'warning' | 'critical'
  title       TEXT NOT NULL,
  body        TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_alerts_active ON public.emergency_alerts (is_active, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.emergency_alerts TO authenticated;
GRANT ALL ON public.emergency_alerts TO service_role;

ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/staff read alerts"
  ON public.emergency_alerts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin/staff insert alerts"
  ON public.emergency_alerts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin/staff update alerts"
  ON public.emergency_alerts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin delete alerts"
  ON public.emergency_alerts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4) ANNOUNCEMENTS -------------------------------------------------
CREATE TABLE public.announcements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID,
  title       TEXT NOT NULL,
  body        TEXT,
  audience    TEXT NOT NULL DEFAULT 'internal'   -- 'internal' | 'partners' | 'public'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/staff read announcements"
  ON public.announcements FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin/staff insert announcements"
  ON public.announcements FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin update announcements"
  ON public.announcements FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin delete announcements"
  ON public.announcements FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5) Audit trigger on referrals status changes --------------------
CREATE OR REPLACE FUNCTION public.audit_referral_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.audit_logs (actor_id, event_type, entity_type, entity_id, action, summary, metadata)
    VALUES (
      auth.uid(),
      'referral_status_change',
      'referral',
      NEW.id::text,
      'status_changed',
      'Referral ' || left(NEW.id::text, 8) || ' status: ' || COALESCE(OLD.status, '∅') || ' → ' || NEW.status,
      jsonb_build_object('from', OLD.status, 'to', NEW.status, 'household', NEW.household)
    );
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.audit_referral_status_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_audit_referral_status_change ON public.referrals;
CREATE TRIGGER trg_audit_referral_status_change
  AFTER UPDATE OF status ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.audit_referral_status_change();
