
-- 1. audit_logs: remove authenticated insert, restrict to service_role
DROP POLICY IF EXISTS "Authenticated insert audit logs" ON public.audit_logs;
REVOKE INSERT ON public.audit_logs FROM authenticated;
GRANT INSERT ON public.audit_logs TO service_role;

-- 2. profiles: allow staff to read profiles for referral workflows
CREATE POLICY "Staff can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff'::app_role));

-- 3. Revoke authenticated EXECUTE on internal email queue functions
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, authenticated, anon;

-- 4. notify_staff_rate_limits: ensure no grants to authenticated/anon (documented lockdown)
REVOKE ALL ON public.notify_staff_rate_limits FROM PUBLIC, authenticated, anon;
COMMENT ON TABLE public.notify_staff_rate_limits IS 'Stores IP addresses for contact-form rate limiting. Must remain accessible only to service_role via SECURITY DEFINER function check_notify_staff_rate_limit. Do not add authenticated/anon policies.';
