
-- Restrict donor PII to admins only
DROP POLICY IF EXISTS "Admin/staff read donations" ON public.donations;
CREATE POLICY "Admin read donations" ON public.donations
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Restrict staff PII to admins only
DROP POLICY IF EXISTS "Staff view staff" ON public.staff;
CREATE POLICY "Admin view staff" ON public.staff
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Restrict volunteer PII to admins only
DROP POLICY IF EXISTS "Staff view volunteers" ON public.volunteers;
CREATE POLICY "Admin view volunteers" ON public.volunteers
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
