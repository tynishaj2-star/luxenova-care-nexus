
CREATE POLICY "board-docs owners manage own files"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'board-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'board-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "board-docs admins view all"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'board-documents'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "board-docs board views shared"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'board-documents'
    AND public.has_role(auth.uid(), 'board')
    AND EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.file_path = storage.objects.name
        AND d.visibility IN ('board','staff')
    )
  );

CREATE POLICY "board-docs staff views shared"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'board-documents'
    AND public.has_role(auth.uid(), 'staff')
    AND EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.file_path = storage.objects.name
        AND d.visibility = 'staff'
    )
  );
