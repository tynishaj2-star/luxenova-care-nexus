CREATE TABLE IF NOT EXISTS public.notify_staff_rate_limits (
  ip text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, window_start)
);

GRANT ALL ON public.notify_staff_rate_limits TO service_role;

ALTER TABLE public.notify_staff_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies: only service role (which bypasses RLS) may read/write.

CREATE OR REPLACE FUNCTION public.check_notify_staff_rate_limit(
  _ip text,
  _max integer,
  _window_seconds integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _bucket timestamptz;
  _count integer;
BEGIN
  _bucket := date_trunc('minute', now()) - (extract(epoch from now())::int % _window_seconds) * interval '1 second';
  -- best-effort cleanup of old buckets
  DELETE FROM public.notify_staff_rate_limits
    WHERE window_start < now() - interval '1 hour';

  INSERT INTO public.notify_staff_rate_limits AS r (ip, window_start, count)
    VALUES (_ip, _bucket, 1)
  ON CONFLICT (ip, window_start)
    DO UPDATE SET count = r.count + 1
  RETURNING count INTO _count;

  RETURN _count <= _max;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_notify_staff_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_notify_staff_rate_limit(text, integer, integer) TO service_role;