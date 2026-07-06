
-- 1. Revoke EXECUTE on has_role from anon (keep for authenticated so RLS still evaluates for signed-in users)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;

-- 2. Restrict org_settings SELECT to staff/admin/board only
DROP POLICY IF EXISTS "Any authed view org settings" ON public.org_settings;
CREATE POLICY "Staff view org settings"
  ON public.org_settings
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'staff')
    OR public.has_role(auth.uid(), 'board')
  );

-- 3. Restrict task_attachments SELECT to task assignee/creator, uploader, staff/admin/board
DROP POLICY IF EXISTS "Authed view task attachments" ON public.task_attachments;
CREATE POLICY "Task participants view attachments"
  ON public.task_attachments
  FOR SELECT
  TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'staff')
    OR public.has_role(auth.uid(), 'board')
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_attachments.task_id
        AND (t.assigned_to = auth.uid() OR t.created_by = auth.uid())
    )
  );
