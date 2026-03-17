ALTER TABLE public.bookings REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.brand_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pricing_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.map_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;

CREATE TABLE IF NOT EXISTS public.payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publishable_key text,
  webhook_endpoint_path text NOT NULL DEFAULT 'stripe-webhook',
  checkout_success_path text NOT NULL DEFAULT '/booking/confirmation',
  checkout_cancel_path text NOT NULL DEFAULT '/',
  mode text NOT NULL DEFAULT 'test',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payment settings are viewable by admins" ON public.payment_settings;
CREATE POLICY "Payment settings are viewable by admins"
ON public.payment_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert payment settings" ON public.payment_settings;
CREATE POLICY "Admins can insert payment settings"
ON public.payment_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update payment settings" ON public.payment_settings;
CREATE POLICY "Admins can update payment settings"
ON public.payment_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete payment settings" ON public.payment_settings;
CREATE POLICY "Admins can delete payment settings"
ON public.payment_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON public.payment_settings;
CREATE TRIGGER update_payment_settings_updated_at
BEFORE UPDATE ON public.payment_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.payment_settings (id)
SELECT '44444444-4444-4444-4444-444444444444'
WHERE NOT EXISTS (
  SELECT 1 FROM public.payment_settings WHERE id = '44444444-4444-4444-4444-444444444444'
);