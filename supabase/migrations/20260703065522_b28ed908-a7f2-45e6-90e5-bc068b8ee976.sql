
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  file_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','board','staff','admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their documents"
  ON public.documents FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins view all documents"
  ON public.documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Board views shared documents"
  ON public.documents FOR SELECT TO authenticated
  USING (
    visibility IN ('board','staff')
    AND public.has_role(auth.uid(), 'board')
  );

CREATE POLICY "Staff views shared documents"
  ON public.documents FOR SELECT TO authenticated
  USING (
    visibility = 'staff'
    AND public.has_role(auth.uid(), 'staff')
  );

CREATE INDEX idx_documents_owner ON public.documents(owner_id, created_at DESC);

CREATE TRIGGER documents_set_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
