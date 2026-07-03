
CREATE POLICY "Admin/staff read expense receipts" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'expense-receipts' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));

CREATE POLICY "Admin/staff upload expense receipts" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'expense-receipts' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));

CREATE POLICY "Admin/staff update expense receipts" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'expense-receipts' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')))
  WITH CHECK (bucket_id = 'expense-receipts' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));

CREATE POLICY "Admin/staff delete expense receipts" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'expense-receipts' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));
