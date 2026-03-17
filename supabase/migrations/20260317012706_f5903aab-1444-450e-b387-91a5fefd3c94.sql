INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-assets', 'admin-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admin assets are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'admin-assets');

CREATE POLICY "Admins can upload admin assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'admin-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update admin assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'admin-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'admin-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete admin assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'admin-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);