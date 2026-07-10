
-- Registrations
CREATE TABLE public.back_to_school_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_first_name text NOT NULL,
  parent_last_name text NOT NULL,
  email text,
  phone text NOT NULL,
  preferred_contact text NOT NULL DEFAULT 'phone',
  street_address text NOT NULL,
  apartment text,
  city text,
  state text NOT NULL DEFAULT 'Massachusetts',
  zip text,
  adults_count int,
  children_count int,
  snap boolean NOT NULL DEFAULT false,
  wic boolean NOT NULL DEFAULT false,
  masshealth boolean NOT NULL DEFAULT false,
  housing_status text,
  additional_info text,
  agree_accurate boolean NOT NULL DEFAULT false,
  agree_no_guarantee boolean NOT NULL DEFAULT false,
  agree_contact boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  internal_notes text,
  submitted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.back_to_school_registrations TO authenticated;
GRANT INSERT ON public.back_to_school_registrations TO anon;
GRANT ALL ON public.back_to_school_registrations TO service_role;

ALTER TABLE public.back_to_school_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit registration"
  ON public.back_to_school_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    agree_accurate = true
    AND agree_no_guarantee = true
    AND agree_contact = true
  );

CREATE POLICY "Admins can view registrations"
  ON public.back_to_school_registrations
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations"
  ON public.back_to_school_registrations
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
  ON public.back_to_school_registrations
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_back_to_school_registrations_updated_at
  BEFORE UPDATE ON public.back_to_school_registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Students
CREATE TABLE public.back_to_school_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.back_to_school_registrations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  grade text,
  school_name text,
  backpack_needed boolean NOT NULL DEFAULT false,
  special_needs text,
  shirt_size text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bts_students_registration ON public.back_to_school_students(registration_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.back_to_school_students TO authenticated;
GRANT INSERT ON public.back_to_school_students TO anon;
GRANT ALL ON public.back_to_school_students TO service_role;

ALTER TABLE public.back_to_school_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can add students to a registration"
  ON public.back_to_school_students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view students"
  ON public.back_to_school_students
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
  ON public.back_to_school_students
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
  ON public.back_to_school_students
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
