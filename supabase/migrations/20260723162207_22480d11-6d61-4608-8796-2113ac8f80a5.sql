
-- Remove the overly permissive INSERT policy on students.
DROP POLICY IF EXISTS "Anyone can add students to a registration" ON public.back_to_school_students;

-- Atomic submission function: creates the registration and its students in a single transaction.
-- SECURITY DEFINER so anon/authenticated can insert without direct table INSERT rights on students.
CREATE OR REPLACE FUNCTION public.submit_back_to_school_registration(
  registration jsonb,
  students jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  s jsonb;
BEGIN
  IF registration IS NULL THEN
    RAISE EXCEPTION 'registration payload required';
  END IF;

  INSERT INTO public.back_to_school_registrations (
    parent_first_name, parent_last_name, email, phone, preferred_contact,
    street_address, apartment, city, state, zip,
    adults_count, children_count, snap, wic, masshealth,
    housing_status, additional_info,
    agree_accurate, agree_no_guarantee, agree_contact
  ) VALUES (
    NULLIF(registration->>'parent_first_name',''),
    NULLIF(registration->>'parent_last_name',''),
    NULLIF(registration->>'email',''),
    NULLIF(registration->>'phone',''),
    COALESCE(NULLIF(registration->>'preferred_contact',''),'phone'),
    NULLIF(registration->>'street_address',''),
    NULLIF(registration->>'apartment',''),
    NULLIF(registration->>'city',''),
    COALESCE(NULLIF(registration->>'state',''),'Massachusetts'),
    NULLIF(registration->>'zip',''),
    NULLIF(registration->>'adults_count','')::int,
    NULLIF(registration->>'children_count','')::int,
    COALESCE((registration->>'snap')::boolean, false),
    COALESCE((registration->>'wic')::boolean, false),
    COALESCE((registration->>'masshealth')::boolean, false),
    NULLIF(registration->>'housing_status',''),
    NULLIF(registration->>'additional_info',''),
    COALESCE((registration->>'agree_accurate')::boolean, false),
    COALESCE((registration->>'agree_no_guarantee')::boolean, false),
    COALESCE((registration->>'agree_contact')::boolean, false)
  )
  RETURNING id INTO new_id;

  IF jsonb_typeof(students) = 'array' THEN
    FOR s IN SELECT * FROM jsonb_array_elements(students)
    LOOP
      -- Skip completely empty rows
      IF COALESCE(NULLIF(s->>'first_name',''), NULLIF(s->>'last_name','')) IS NULL THEN
        CONTINUE;
      END IF;
      INSERT INTO public.back_to_school_students (
        registration_id, first_name, last_name, date_of_birth, grade,
        school_name, backpack_needed, special_needs, shirt_size
      ) VALUES (
        new_id,
        COALESCE(NULLIF(s->>'first_name',''),''),
        COALESCE(NULLIF(s->>'last_name',''),''),
        NULLIF(s->>'date_of_birth','')::date,
        NULLIF(s->>'grade',''),
        NULLIF(s->>'school_name',''),
        COALESCE((s->>'backpack_needed')::boolean, true),
        NULLIF(s->>'special_needs',''),
        NULLIF(s->>'shirt_size','')
      );
    END LOOP;
  END IF;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_back_to_school_registration(jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_back_to_school_registration(jsonb, jsonb) TO anon, authenticated;
