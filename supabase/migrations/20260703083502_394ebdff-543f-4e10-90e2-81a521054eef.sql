
-- 1) Guard: prevent non-admins from changing profiles.must_change_password
CREATE OR REPLACE FUNCTION public.profiles_guard_must_change_password()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.must_change_password IS DISTINCT FROM OLD.must_change_password
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.must_change_password := OLD.must_change_password;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.profiles_guard_must_change_password() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_profiles_guard_mcp ON public.profiles;
CREATE TRIGGER trg_profiles_guard_mcp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_guard_must_change_password();

-- 2) Explicit deny policies for activity_feed writes from client roles
-- Writes are intended to flow only through SECURITY DEFINER triggers / service role.
DROP POLICY IF EXISTS "No direct inserts on activity_feed" ON public.activity_feed;
DROP POLICY IF EXISTS "No direct updates on activity_feed" ON public.activity_feed;
DROP POLICY IF EXISTS "No direct deletes on activity_feed" ON public.activity_feed;

CREATE POLICY "No direct inserts on activity_feed" ON public.activity_feed
  FOR INSERT TO authenticated, anon
  WITH CHECK (false);

CREATE POLICY "No direct updates on activity_feed" ON public.activity_feed
  FOR UPDATE TO authenticated, anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No direct deletes on activity_feed" ON public.activity_feed
  FOR DELETE TO authenticated, anon
  USING (false);

-- 3) Lock down notify_staff_rate_limits completely from client roles
-- Only the SECURITY DEFINER function check_notify_staff_rate_limit (service_role) touches it.
REVOKE ALL ON TABLE public.notify_staff_rate_limits FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "No client access to rate limits" ON public.notify_staff_rate_limits;
CREATE POLICY "No client access to rate limits" ON public.notify_staff_rate_limits
  FOR ALL TO authenticated, anon
  USING (false)
  WITH CHECK (false);
