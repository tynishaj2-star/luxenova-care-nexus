
DROP POLICY IF EXISTS "Anyone can add students to a registration" ON public.back_to_school_students;

CREATE POLICY "Anyone can add students to a registration"
  ON public.back_to_school_students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.back_to_school_registrations r
      WHERE r.id = registration_id
    )
  );
