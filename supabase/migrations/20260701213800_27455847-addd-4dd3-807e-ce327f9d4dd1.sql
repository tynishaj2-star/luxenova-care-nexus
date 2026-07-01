
INSERT INTO public.board_members (user_id, member_key, full_name)
VALUES
  ('49471d4b-6123-4a8a-b37e-b466fe497940', 'tynisha', 'Tynisha Johnson'),
  ('171b89bf-4f5f-4396-9744-5b5e8cdd1d6c', 'trina',   'Trina Everett'),
  ('0b4e48fc-8ab9-4496-8108-055ef451371e', 'joe',     'Joe Younge')
ON CONFLICT (user_id) DO UPDATE
  SET member_key = EXCLUDED.member_key,
      full_name  = EXCLUDED.full_name;
