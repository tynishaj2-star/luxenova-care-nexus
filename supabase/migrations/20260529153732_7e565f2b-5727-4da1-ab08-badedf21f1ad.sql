-- Role elevation requests: partners ask, admins approve/deny.
CREATE TABLE public.role_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  requested_role app_role NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX role_requests_one_pending_per_user_role
  ON public.role_requests (user_id, requested_role)
  WHERE status = 'pending';

GRANT SELECT, INSERT, UPDATE ON public.role_requests TO authenticated;
GRANT ALL ON public.role_requests TO service_role;

ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

-- Users can see their own requests
CREATE POLICY "Users view own role requests"
  ON public.role_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can see all
CREATE POLICY "Admins view all role requests"
  ON public.role_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Users create their own requests (defensive — server fn enforces too)
CREATE POLICY "Users create own role requests"
  ON public.role_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Only admins can update (approve/deny)
CREATE POLICY "Admins decide role requests"
  ON public.role_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER role_requests_set_updated_at
  BEFORE UPDATE ON public.role_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
