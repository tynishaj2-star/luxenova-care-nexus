-- Add board role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'board';

-- Mapping table: which board member is this user?
CREATE TABLE IF NOT EXISTS public.board_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  member_key TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Board members view own mapping"
ON public.board_members FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all board mappings"
ON public.board_members FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage board mappings insert"
ON public.board_members FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage board mappings update"
ON public.board_members FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage board mappings delete"
ON public.board_members FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));