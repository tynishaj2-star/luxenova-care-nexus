DROP POLICY IF EXISTS "Board members view directory" ON public.board_members;

CREATE POLICY "Board staff and admins view board directory"
ON public.board_members
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'board')
  OR public.has_role(auth.uid(), 'staff')
  OR public.has_role(auth.uid(), 'admin')
);