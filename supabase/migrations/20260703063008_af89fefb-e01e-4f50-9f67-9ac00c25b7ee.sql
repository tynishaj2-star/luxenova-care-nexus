
CREATE POLICY "Board members view directory" ON public.board_members
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.board_members bm WHERE bm.user_id = auth.uid()));
